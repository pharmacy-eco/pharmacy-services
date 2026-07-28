import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { ApiKeys } from '../../../entity/api_keys.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
    imports: [TypeOrmModule.forFeature([ApiKeys])],
    controllers: [ChatController],
    providers: [ChatService, ResponseService],
})
export class FrontendChatModule {}
