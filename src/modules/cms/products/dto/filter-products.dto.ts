import { ApiProperty } from '@nestjs/swagger';
import { SortOption } from '../../../../common/types/sort.type';
import { IStatusEnum } from '../../../../common/enum';

export class FilterProductsDto {
    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false, enum: IStatusEnum })
    status: IStatusEnum;

    @ApiProperty({ required: false })
    pageSize: number;

    @ApiProperty({ required: false })
    pageIndex: number;

    @ApiProperty({ required: false })
    sort: SortOption;
}
