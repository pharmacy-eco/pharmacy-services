import { IStatusEnum } from '../../../../common/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateBlogsDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @ApiProperty()
    title: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ enum: IStatusEnum })
    status: IStatusEnum;

    @ApiProperty()
    meta_title: string;

    @ApiProperty()
    meta_description: string;

    @IsNotEmpty({ message: 'category không được để trống' })
    @ApiProperty()
    category_id: number;

    @IsNotEmpty({ message: 'content không được để trống' })
    @ApiProperty()
    content: string;
}
