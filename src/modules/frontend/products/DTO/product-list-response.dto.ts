import { ApiProperty } from '@nestjs/swagger';
import {
    IProductCategorySummary,
    IProductListApiResponse,
    IProductListItem,
    IProductsByCategoryResponse,
} from '../interfaces/product-list-response.interface';

export class ProductCategorySummaryDto implements IProductCategorySummary {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Vitamin và khoáng chất' })
    name: string;

    @ApiProperty({ example: 'vitamin-va-khoang-chat' })
    slug: string;
}

export class ProductListItemDto implements IProductListItem {
    @ApiProperty({ example: 10 })
    id: number;

    @ApiProperty({ example: 'Vitamin C 500mg' })
    name: string;

    @ApiProperty({ example: 'Vitamin C chính hãng' })
    meta_name: string;

    @ApiProperty({ example: 'vitamin-c-500mg' })
    slug: string;

    @ApiProperty({ example: 'Hộp' })
    unit: string;

    @ApiProperty({ type: 'object', additionalProperties: true, example: { dosage: '500mg' } })
    optionals: Record<string, string | number | boolean>;

    @ApiProperty({ example: 150000 })
    price: number;

    @ApiProperty({ example: 120000 })
    current_price: number;

    @ApiProperty({ example: 'https://example.com/product-thumbnail.jpg' })
    thumbnail: string;

    @ApiProperty({ type: [ProductCategorySummaryDto] })
    categories: ProductCategorySummaryDto[];
}

export class ProductsByCategoryResponseDto implements IProductsByCategoryResponse {
    @ApiProperty({ type: ProductCategorySummaryDto })
    category: ProductCategorySummaryDto;

    @ApiProperty({ example: 1 })
    pageIndex: number;

    @ApiProperty({ example: 20 })
    pageSize: number;

    @ApiProperty({ example: 3 })
    totalPages: number;

    @ApiProperty({ example: 52 })
    totalItems: number;

    @ApiProperty({ type: [ProductListItemDto] })
    items: ProductListItemDto[];
}

class ProductListResponseErrorDto {
    @ApiProperty({ example: 200 })
    code: number;

    @ApiProperty({ example: 'Lấy dữ liệu thành công' })
    message: string;
}

export class ProductListApiResponseDto implements IProductListApiResponse {
    @ApiProperty({ example: 'f3e85a23-1015-4ea4-b4ee-f1ba97d2e755' })
    requestId: string;

    @ApiProperty({ example: '2026-07-21T10:00:00.000Z' })
    at: string;

    @ApiProperty({ type: ProductListResponseErrorDto })
    error: ProductListResponseErrorDto;

    @ApiProperty({ type: ProductsByCategoryResponseDto })
    data: ProductsByCategoryResponseDto;
}
