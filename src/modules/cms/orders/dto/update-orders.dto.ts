import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrdersDto {
    @IsNotEmpty({ message: 'Trạng thái đơn hàng không được để trống' })
    @ApiProperty()
    status: number;
}
