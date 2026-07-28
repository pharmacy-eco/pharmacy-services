import { Body, Controller, Post, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../auth/decorators/jwt.decorators';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { IRequestInfo } from '../../../common/types';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@ApiTags('Chat AI')
@Controller('chat')
@Public()
@UseInterceptors(LoggingInterceptor)
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly responseService: ResponseService,
    ) {}

    @Post('message')
    @ApiOperation({ summary: 'Gửi tin nhắn người dùng lên Google AI Studio và trả response' })
    @UsePipes(new CustomValidationPipe())
    async sendMessage(@Body() payload: ChatMessageDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.chatService.sendMessage(payload);

        return this.responseService.createResponse(
            200,
            'Gửi tin nhắn thành công',
            requestInfo.requestId,
            requestInfo.at,
            data,
        );
    }
}
