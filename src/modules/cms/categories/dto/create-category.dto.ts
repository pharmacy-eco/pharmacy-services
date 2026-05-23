import { ICategoryType, IStatusEnum } from '../../../../common/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
    @ApiProperty()
    name: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ enum: IStatusEnum })
    status: IStatusEnum;

    @ApiProperty()
    parent_id?: number;

    @ApiProperty()
    meta_name: string;

    @ApiProperty({ enum: ICategoryType, example: "PRODUCT = 'PRODUCT',BRAND = 'BRAND'" })
    type: ICategoryType;

    @ApiProperty()
    meta_description: string;
}
