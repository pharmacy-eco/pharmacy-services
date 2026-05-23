import { IStatusEnum } from '../../../../common/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductsDto {
    @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'price sản phẩm không được để trống' })
    @ApiProperty()
    price: number;

    @IsNotEmpty({ message: 'current_price sản phẩm không được để trống' })
    @ApiProperty()
    current_price: number;

    @ApiProperty({ example: '1 = HOT, 0 = NOTHOT ', default: 0 })
    is_hot: number;

    @ApiProperty({ example: 'Chai, Hộp ', default: 'Hộp' })
    unit: string;

    @IsNotEmpty({ message: 'Ảnh sản phẩm không được để trống' })
    @ApiProperty()
    image: Array<string>;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: [Number], example: [1, 2, 3], description: 'Danh sách danh mục của sản phẩm' })
    @IsNotEmpty({ message: 'Không được để trống' })
    category: Array<string | number>;

    @ApiProperty()
    content: string;

    @ApiProperty()
    meta_name: string;

    @ApiProperty()
    meta_description: string;

    @ApiProperty({ type: 'json' })
    optionals: Record<string, string | number | boolean>;

    @ApiProperty({ enum: IStatusEnum })
    status: IStatusEnum;
}
