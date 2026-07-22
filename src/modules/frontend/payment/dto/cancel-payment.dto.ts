import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelPaymentDto {
    @ApiProperty({ description: 'Mã đơn hàng cần huỷ giao dịch' })
    @IsString({ message: 'Mã đơn hàng phải là chuỗi' })
    @IsNotEmpty({ message: 'Mã đơn hàng không được để trống' })
    orderCode: string;
}
