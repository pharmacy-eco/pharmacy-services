import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChatHistoryDto {
    @ApiProperty({ enum: ['user', 'model'] })
    role: 'user' | 'model';

    @ApiProperty()
    text: string;
}

export class ChatMessageDto {
    @IsNotEmpty({ message: 'Tin nhắn không được để trống' })
    @ApiProperty()
    message: string;

    @ApiProperty({ required: false })
    api_key_id: number;

    @ApiProperty({ required: false, type: [ChatHistoryDto] })
    history: ChatHistoryDto[];

    @ApiProperty({ required: false })
    system_instruction: string;
}
