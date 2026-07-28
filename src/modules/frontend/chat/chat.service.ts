import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { ApiKeys } from '../../../entity/api_keys.entity';
import { ChatMessageDto } from './dto/chat-message.dto';

interface GeminiPart {
    text: string;
}

interface GeminiContent {
    role?: 'user' | 'model';
    parts: GeminiPart[];
}

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: GeminiPart[];
        };
    }>;
    usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
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
        const contents = this.buildContents(payload);
        const requestBody: Record<string, unknown> = { contents };

        if (payload.system_instruction) {
            requestBody.systemInstruction = {
                parts: [{ text: payload.system_instruction }],
            };
        }

        try {
            const model = apiKey.model || 'gemini-3.6-flash';
            const response = await axios.post<GeminiResponse>(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                requestBody,
                {
                    headers: { 'Content-Type': 'application/json' },
                    params: { key: apiKey.api_key },
                },
            );

            const responseMessage = this.extractResponseMessage(response.data);
            const usage = response.data.usageMetadata || {};
            const totalTokenCount =
                usage.totalTokenCount ||
                this.estimateTokenCount(payload.message) + this.estimateTokenCount(responseMessage);

            const savedApiKey = await this.increaseTokenUsed(apiKey, totalTokenCount);

            return {
                message: responseMessage,
                model,
                api_key_id: savedApiKey.id,
                usage: {
                    prompt_token_count: usage.promptTokenCount || 0,
                    candidates_token_count: usage.candidatesTokenCount || 0,
                    total_token_count: totalTokenCount,
                    token_quota: savedApiKey.token_quota || 0,
                    token_used: savedApiKey.token_used || 0,
                    token_remaining:
                        savedApiKey.token_quota > 0 ? Math.max(savedApiKey.token_quota - savedApiKey.token_used, 0) : 0,
                },
            };
        } catch (error) {
            logger.error('Lỗi khi gọi Google AI Studio API.');
            logger.error(error.response?.data || error.stack);
            throw new ServiceUnavailableException('Không gọi được Google AI Studio API. Vui lòng thử lại sau.');
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

    private buildContents(payload: ChatMessageDto): GeminiContent[] {
        const history = Array.isArray(payload.history) ? payload.history : [];
        const contents = history
            .filter((item) => item?.text && ['user', 'model'].includes(item.role))
            .map((item) => ({
                role: item.role,
                parts: [{ text: item.text }],
            }));

        contents.push({
            role: 'user',
            parts: [{ text: payload.message }],
        });

        return contents;
    }

    private extractResponseMessage(response: GeminiResponse): string {
        const parts = response.candidates?.[0]?.content?.parts || [];
        const message = parts
            .map((part) => part.text)
            .join('\n')
            .trim();

        if (!message) {
            throw new ServiceUnavailableException('Google AI Studio không trả về nội dung phản hồi.');
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
