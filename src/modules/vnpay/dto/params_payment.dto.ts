import { ApiProperty } from '@nestjs/swagger';

export class ParamsPaymentDto {
    @ApiProperty()
    orderCode: string;

    @ApiProperty({ required: false })
    amount?: number;

    @ApiProperty({ required: false })
    bankCode?: string;
}
