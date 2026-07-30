import {
    BadGatewayException,
    BadRequestException,
    GatewayTimeoutException,
    HttpException,
    HttpStatus,
    Injectable,
    ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { ApiKeys } from '../../../entity/api_keys.entity';
import { ChatMessageDto } from './dto/chat-message.dto';

const GEMINI_INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const GEMINI_REQUEST_TIMEOUT_MS = 120_000;
const GEMINI_MAX_ATTEMPTS = 4;
const GEMINI_RETRY_BASE_DELAY_MS = 1_000;
const GEMINI_RETRY_JITTER_MS = 250;

interface GeminiInteractionRequest {
    model: string;
    input: string;
    store: boolean;
    previous_interaction_id?: string;
    system_instruction?: string;
}

interface GeminiTextContent {
    type?: string;
    text?: string;
}

interface GeminiInteractionStep {
    type?: string;
    content?: GeminiTextContent[];
}

interface GeminiInteractionResponse {
    id?: string;
    status?: string;
    model?: string;
    steps?: GeminiInteractionStep[];
    usage?: {
        total_tokens?: number;
        total_input_tokens?: number;
        total_output_tokens?: number;
    };
}

interface GeminiErrorResponse {
    error?: {
        code?: number;
        message?: string;
        status?: string;
    };
}

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ApiKeys)
        private apiKeysRepository: Repository<ApiKeys>,
    ) {}

    async sendMessage(payload: ChatMessageDto) {
        const apiKey = await this.findAvailableApiKey(payload.api_key_id);
        const model = apiKey.model || 'gemini-3.6-flash';
        const requestBody = this.buildInteractionRequest(payload, model);
        const response = await this.createInteraction(requestBody, apiKey.api_key);
        const responseMessage = this.extractResponseMessage(response);
        const usage = response.usage || {};
        const totalTokenCount =
            usage.total_tokens || this.estimateTokenCount(payload.message) + this.estimateTokenCount(responseMessage);
        const savedApiKey = await this.increaseTokenUsed(apiKey, totalTokenCount);

        return {
            message: responseMessage,
            interaction_id: response.id,
            model: response.model || model,
            api_key_id: savedApiKey.id,
            usage: {
                prompt_token_count: usage.total_input_tokens || 0,
                candidates_token_count: usage.total_output_tokens || 0,
                total_token_count: totalTokenCount,
                token_quota: savedApiKey.token_quota || 0,
                token_used: savedApiKey.token_used || 0,
                token_remaining:
                    savedApiKey.token_quota > 0 ? Math.max(savedApiKey.token_quota - savedApiKey.token_used, 0) : 0,
            },
        };
    }

    private buildInteractionRequest(payload: ChatMessageDto, model: string): GeminiInteractionRequest {
        const requestBody: GeminiInteractionRequest = {
            model,
            input: payload.message,
            store: true,
        };

        if (payload.previous_interaction_id) {
            requestBody.previous_interaction_id = payload.previous_interaction_id;
        }

        if (payload.system_instruction) {
            requestBody.system_instruction = payload.system_instruction;
        }

        return requestBody;
    }

    private async createInteraction(
        requestBody: GeminiInteractionRequest,
        apiKey: string,
    ): Promise<GeminiInteractionResponse> {
        let lastError: unknown;

        for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt += 1) {
            try {
                const response = await axios.post<GeminiInteractionResponse>(GEMINI_INTERACTIONS_URL, requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': apiKey,
                    },
                    timeout: GEMINI_REQUEST_TIMEOUT_MS,
                });

                return response.data;
            } catch (error) {
                lastError = error;

                if (!this.isRetryableError(error) || attempt === GEMINI_MAX_ATTEMPTS) {
                    break;
                }

                const delayMs = this.getRetryDelay(attempt);
                logger.warn(
                    JSON.stringify({
                        message: 'Gemini Interactions API tạm thời không khả dụng, đang thử lại.',
                        model: requestBody.model,
                        attempt,
                        next_attempt: attempt + 1,
                        delay_ms: delayMs,
                        upstream_status: this.getUpstreamStatus(error),
                    }),
                );
                await this.waitBeforeRetry(delayMs);
            }
        }

        this.logGeminiError(lastError, requestBody.model);
        throw this.toGeminiHttpException(lastError);
    }

    private isRetryableError(error: unknown): boolean {
        if (!axios.isAxiosError(error)) {
            return false;
        }

        const status = error.response?.status;
        return (
            !status || status === HttpStatus.REQUEST_TIMEOUT || status === HttpStatus.TOO_MANY_REQUESTS || status >= 500
        );
    }

    private getRetryDelay(attempt: number): number {
        const exponentialDelay = GEMINI_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
        const jitter = Math.floor(Math.random() * GEMINI_RETRY_JITTER_MS);
        return exponentialDelay + jitter;
    }

    private waitBeforeRetry(delayMs: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    private getUpstreamStatus(error: unknown): number | undefined {
        return axios.isAxiosError(error) ? error.response?.status : undefined;
    }

    private getGeminiErrorDetails(error: unknown) {
        if (!axios.isAxiosError<GeminiErrorResponse>(error)) {
            return {
                status: undefined,
                code: undefined,
                message: error instanceof Error ? error.message : 'Unknown error',
            };
        }

        return {
            status: error.response?.status,
            code: error.response?.data?.error?.status,
            message: error.response?.data?.error?.message || error.message,
        };
    }

    private logGeminiError(error: unknown, model: string): void {
        const details = this.getGeminiErrorDetails(error);
        logger.error(
            JSON.stringify({
                message: 'Lỗi khi gọi Gemini Interactions API.',
                model,
                upstream_status: details.status,
                upstream_code: details.code,
                upstream_message: details.message,
            }),
        );
    }

    private toGeminiHttpException(error: unknown): HttpException {
        const details = this.getGeminiErrorDetails(error);

        switch (details.status) {
            case HttpStatus.BAD_REQUEST:
                return new BadRequestException(`Yêu cầu gửi tới Google Gemini không hợp lệ: ${details.message}`);
            case HttpStatus.TOO_MANY_REQUESTS:
                return new HttpException(
                    'Google Gemini đang giới hạn tần suất yêu cầu. Vui lòng thử lại sau.',
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            case HttpStatus.SERVICE_UNAVAILABLE:
                return new ServiceUnavailableException(
                    'Google Gemini đang tạm thời quá tải hoặc không khả dụng. Vui lòng thử lại sau.',
                );
            case HttpStatus.GATEWAY_TIMEOUT:
                return new GatewayTimeoutException('Google Gemini không phản hồi kịp thời. Vui lòng thử lại sau.');
            case HttpStatus.UNAUTHORIZED:
            case HttpStatus.FORBIDDEN:
                return new BadGatewayException('API key Google Gemini không hợp lệ hoặc không có quyền truy cập.');
            case HttpStatus.NOT_FOUND:
                return new BadGatewayException('Model hoặc tài nguyên Google Gemini không tồn tại.');
            default:
                return new BadGatewayException('Không gọi được Google Gemini API. Vui lòng thử lại sau.');
        }
    }

    private async findAvailableApiKey(apiKeyId?: number) {
        const today = new Date().toISOString().slice(0, 10);
        const queryBuilder = this.apiKeysRepository
            .createQueryBuilder('api_keys')
            .where('api_keys.status = :status', { status: 1 })
            .andWhere('api_keys.expires_at >= :today', { today })
            .andWhere('(api_keys.token_quota <= 0 OR api_keys.token_used < api_keys.token_quota)')
            .orderBy('api_keys.id', 'ASC');

        if (apiKeyId) {
            queryBuilder.andWhere('api_keys.id = :apiKeyId', { apiKeyId });
        }

        const apiKey = await queryBuilder.getOne();
        if (!apiKey) {
            throw new BadRequestException('Không có API key khả dụng hoặc API key đã hết hạn/hết quota token.');
        }

        return apiKey;
    }

    private extractResponseMessage(response: GeminiInteractionResponse): string {
        const message = (response.steps || [])
            .filter((step) => step.type === 'model_output')
            .flatMap((step) => step.content || [])
            .filter((content) => content.type === 'text' && content.text)
            .map((content) => content.text)
            .join('\n')
            .trim();

        if (!response.id || response.status !== 'completed' || !message) {
            throw new ServiceUnavailableException('Google Gemini không trả về nội dung phản hồi hoàn chỉnh.');
        }

        return message;
    }

    private estimateTokenCount(text: string): number {
        return Math.ceil((text || '').length / 4);
    }

    private async increaseTokenUsed(apiKey: ApiKeys, totalTokenCount: number) {
        apiKey.token_used = (apiKey.token_used || 0) + totalTokenCount;
        return this.apiKeysRepository.save(apiKey);
    }
}
