import { ApiProperty } from '@nestjs/swagger';
import { IFeaturedCategoriesApiResponse, IFeaturedCategory } from '../interfaces/featured-category-response.interface';

export class FeaturedCategoryDto implements IFeaturedCategory {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Vitamin và khoáng chất' })
    name: string;

    @ApiProperty({ example: 'vitamin-va-khoang-chat' })
    slug: string;

    @ApiProperty({ example: 'https://example.com/category-image.jpg' })
    image: string;

    @ApiProperty({ example: 'Vitamin và khoáng chất chính hãng' })
    meta_name: string;

    @ApiProperty({ description: 'Số sản phẩm đang hoạt động trong danh mục', example: 12 })
    product_count: number;
}

class FeaturedCategoriesResponseErrorDto {
    @ApiProperty({ example: 200 })
    code: number;

    @ApiProperty({ example: 'Lấy dữ liệu thành công' })
    message: string;
}

export class FeaturedCategoriesApiResponseDto implements IFeaturedCategoriesApiResponse {
    @ApiProperty({ example: 'f3e85a23-1015-4ea4-b4ee-f1ba97d2e755' })
    requestId: string;

    @ApiProperty({ example: '2026-07-21T10:00:00.000Z' })
    at: string;

    @ApiProperty({ type: FeaturedCategoriesResponseErrorDto })
    error: FeaturedCategoriesResponseErrorDto;

    @ApiProperty({ type: [FeaturedCategoryDto] })
    data: FeaturedCategoryDto[];
}
