import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IStatusEnum } from '../../../../common/enum';

export class CreateApiKeyDto {
    @IsNotEmpty({ message: 'Tên API key không được để trống' })
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'API key không được để trống' })
    @ApiProperty()
    api_key: string;

    @ApiProperty({ required: false, example: 'gemini-3.6-flash' })
    model: string;

    @IsNotEmpty({ message: 'Thời gian hết hạn không được để trống' })
    @ApiProperty({ example: '2026-12-31' })
    expires_at: Date;

    @ApiProperty({ example: 1000000 })
    token_quota: number;

    @ApiProperty({ enum: IStatusEnum })
    status: IStatusEnum;
}
