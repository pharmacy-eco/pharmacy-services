import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IStatusEnum } from '../../../../common/enum';

export class UpdateApiKeyDto {
    @IsNotEmpty({ message: 'Tên API key không được để trống' })
    @ApiProperty()
    name: string;

    @ApiProperty({ required: false })
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
