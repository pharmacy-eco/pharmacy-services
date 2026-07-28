import { ApiProperty } from '@nestjs/swagger';
import { IStatusEnum } from '../../../../common/enum';
import { SortOption } from '../../../../common/types/sort.type';

export class FilterApiKeyDto {
    @ApiProperty({ required: false })
    keyword: string;

    @ApiProperty({ required: false, enum: IStatusEnum })
    status: IStatusEnum;

    @ApiProperty({ required: false })
    pageSize: number;

    @ApiProperty({ required: false })
    pageIndex: number;

    @ApiProperty({ required: false })
    sort: SortOption;
}
