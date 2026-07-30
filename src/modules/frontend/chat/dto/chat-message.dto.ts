import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatMessageDto {
    @IsString()
    @IsNotEmpty({ message: 'Tin nhắn không được để trống' })
    @ApiProperty({ example: 'Thuốc này nên uống trước hay sau bữa ăn?' })
    message: string;

    @IsOptional()
    @IsInt()
    @ApiProperty({
        required: false,
        description: 'Nên gửi lại api_key_id từ response trước khi tiếp tục một interaction.',
    })
    api_key_id?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        description: 'ID interaction trước đó do Gemini trả về, dùng để tiếp tục hội thoại.',
    })
    previous_interaction_id?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        description: 'Chỉ dẫn hệ thống áp dụng cho interaction hiện tại.',
    })
    system_instruction?: string;
}
