import { ApiProperty } from '@nestjs/swagger';
import { SortOption } from '../../../../common/types/sort.type';
import { IStatusEnum } from '../../../../common/enum';

export class FilterReviewsDto {
    @ApiProperty({ required: false })
    keyword: string;

    @ApiProperty({ required: false })
    product_id: number;

    @ApiProperty({ required: false, enum: IStatusEnum })
    status: IStatusEnum;

    @ApiProperty({ required: false })
    pageSize: number;

    @ApiProperty({ required: false })
    pageIndex: number;

    @ApiProperty({ required: false })
    sort: SortOption;
}
