import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export enum ProductCategorySortBy {
    NEWEST = 'newest',
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc',
    NAME_ASC = 'name_asc',
    NAME_DESC = 'name_desc',
}

export class FilterProductsByCategoryDto {
    @ApiPropertyOptional({ description: 'Tìm theo tên sản phẩm', example: 'Vitamin C' })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiPropertyOptional({ description: 'Giá bán hiện tại tối thiểu', minimum: 0, example: 100000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    min_price?: number;

    @ApiPropertyOptional({ description: 'Giá bán hiện tại tối đa', minimum: 0, example: 500000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    max_price?: number;

    @ApiPropertyOptional({
        description: 'Cách sắp xếp danh sách',
        enum: ProductCategorySortBy,
        default: ProductCategorySortBy.NEWEST,
    })
    @IsOptional()
    @IsEnum(ProductCategorySortBy)
    sort_by: ProductCategorySortBy = ProductCategorySortBy.NEWEST;

    @ApiPropertyOptional({ description: 'Trang hiện tại, bắt đầu từ 1', minimum: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page_index: number = 1;

    @ApiPropertyOptional({ description: 'Số sản phẩm mỗi trang', minimum: 1, maximum: 100, default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    page_size: number = 20;
}
