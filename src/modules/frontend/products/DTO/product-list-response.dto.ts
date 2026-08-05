import { ApiProperty } from '@nestjs/swagger';
import {
    IProductCategorySummary,
    IProductImageSummary,
    IProductListApiResponse,
    IProductListItem,
    IProductProductionBatchSummary,
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

export class ProductImageSummaryDto implements IProductImageSummary {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'https://example.com/product.jpg' })
    url: string;

    @ApiProperty({ example: 1 })
    is_thumbnail: number;
}

export class ProductProductionBatchSummaryDto implements IProductProductionBatchSummary {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'LOT-2026-001' })
    name: string;

    @ApiProperty({ example: '2026-07-01' })
    manufacturing_date: string;

    @ApiProperty({ example: '2028-07-01' })
    expiration_date: string;

    @ApiProperty({ example: 1000 })
    quantity: number;

    @ApiProperty({ example: 'Việt Nam' })
    production_place: string;

    @ApiProperty({ example: 1 })
    status: number;
}

export class ProductListItemDto implements IProductListItem {
    @ApiProperty({ example: 10 })
    id: number;

    @ApiProperty({ example: 'Vitamin C 500mg' })
    name: string;

    @ApiProperty({ example: 'Vitamin C chính hãng' })
    meta_name: string;

    @ApiProperty({ example: 'Mô tả SEO của sản phẩm' })
    meta_description: string;

    @ApiProperty({ example: 'vitamin-c-500mg' })
    slug: string;

    @ApiProperty({ example: 'Hộp' })
    unit: string;

    @ApiProperty({ example: 'Mô tả ngắn của sản phẩm' })
    description: string;

    @ApiProperty({ example: '<p>Nội dung chi tiết sản phẩm</p>' })
    content: string;

    @ApiProperty({ type: 'object', additionalProperties: true, example: { dosage: '500mg' } })
    optionals: Record<string, string | number | boolean>;

    @ApiProperty({ example: 150000 })
    price: number;

    @ApiProperty({ example: 120000 })
    current_price: number;

    @ApiProperty({ example: 0 })
    is_hot: number;

    @ApiProperty({ example: 1 })
    status: number;

    @ApiProperty({ example: 'https://example.com/product-thumbnail.jpg' })
    thumbnail: string;

    @ApiProperty({ type: [ProductImageSummaryDto] })
    productImage: ProductImageSummaryDto[];

    @ApiProperty({ type: [String], example: ['Vitamin và khoáng chất'] })
    category: string[];

    @ApiProperty({ type: [Number], example: [1, 2] })
    category_ids: number[];

    @ApiProperty({ type: [ProductCategorySummaryDto] })
    categories: ProductCategorySummaryDto[];

    @ApiProperty({ example: 1 })
    production_batch_id: number;

    @ApiProperty({ type: ProductProductionBatchSummaryDto, nullable: true })
    production_batch: ProductProductionBatchSummaryDto | null;

    @ApiProperty({ example: '28/07/2026 10:00:00' })
    created_at: string;

    @ApiProperty({ example: '28/07/2026 10:00:00' })
    updated_at: string;
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
