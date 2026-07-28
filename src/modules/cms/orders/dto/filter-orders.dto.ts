import { ApiProperty } from '@nestjs/swagger';
import { SortOption } from '../../../../common/types/sort.type';

export class FilterOrdersDto {
    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    email: string;

    @ApiProperty({ required: false })
    phone: string;

    @ApiProperty({ required: false })
    code: string;

    @ApiProperty({ required: false })
    status: number;

    @ApiProperty({ required: false })
    payment_method: string;

    @ApiProperty({ required: false })
    payment_status: string;

    @ApiProperty({ required: false })
    pageSize: number;

    @ApiProperty({ required: false })
    pageIndex: number;

    @ApiProperty({ required: false })
    page: number;

    @ApiProperty({ required: false })
    page_size: number;

    @ApiProperty({ required: false })
    sort: SortOption;
}
