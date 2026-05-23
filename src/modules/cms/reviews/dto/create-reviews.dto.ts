import { IStatusEnum } from '../../../../common/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateReviewsDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'product không được để trống' })
    @ApiProperty()
    product_id: number;

    @IsNotEmpty({ message: 'star không được để trống' })
    @ApiProperty()
    star: number;

    @ApiProperty({ enum: IStatusEnum })
    status: IStatusEnum;

    @ApiProperty()
    content: string;
}
