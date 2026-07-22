import { IStatusEnum } from '../../../../common/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductionBatchDto {
    @IsNotEmpty({ message: 'Tên lô sản xuất không được để trống' })
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'Ngày sản xuất không được để trống' })
    @ApiProperty({ example: '2026-07-20' })
    manufacturing_date: Date;

    @IsNotEmpty({ message: 'Ngày hết hạn không được để trống' })
    @ApiProperty({ example: '2028-07-20' })
    expiration_date: Date;

    @IsNotEmpty({ message: 'Số lượng không được để trống' })
    @ApiProperty()
    quantity: number;

    @IsNotEmpty({ message: 'Nơi sản xuất không được để trống' })
    @ApiProperty()
    production_place: string;

    @ApiProperty({ enum: IStatusEnum })
    status: IStatusEnum;
}
