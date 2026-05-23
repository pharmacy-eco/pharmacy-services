import { SortOption } from '../../../../common/types';
import { ApiProperty } from '@nestjs/swagger';

export class filterProductDto {
    @ApiProperty({ required: false })
    keyword: string;

    @ApiProperty({ required: false })
    category_id: number;

    @ApiProperty({ required: false })
    slug: string;

    @ApiProperty({ required: false })
    page_size: number;

    @ApiProperty({ required: false })
    page_index: number;

    @ApiProperty({ required: false })
    sort: SortOption;
}
