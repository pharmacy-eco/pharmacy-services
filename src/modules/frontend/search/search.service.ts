import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { Products } from '../../../entity/products.entity';
import { filterProductDto } from './DTO/filter-products.dto';
import { PageBase } from '../../../common/response/response-page-base';
import { ListProductDto } from './DTO/list-product.dto';

@Injectable({ scope: Scope.REQUEST })
export class SearchService {
    constructor(
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: filterProductDto) {
        try {
            const { keyword, page_index = 1, page_size = 20, slug, category_id, sort } = payload;

            const queryBuilder = this.productsRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.productImage', 'productImage')
                .leftJoinAndSelect('product.category', 'category')
                .select([
                    'product.id',
                    'product.name',
                    'product.meta_name',
                    'product.slug',
                    'product.unit',
                    'product.price',
                    'product.current_price',
                    'productImage.id',
                    'productImage.url',
                    'productImage.is_thumbnail',
                    'category.id',
                    'category.name',
                    'category.slug',
                ]);

            if (sort) {
                queryBuilder.orderBy(`product.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy(`product.id`, 'DESC');
            }

            if (keyword)
                queryBuilder
                    .andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` })
                    .orWhere('product.description LIKE :keyword', { keyword: `%${keyword}%` });

            if (slug) queryBuilder.andWhere('category.slug = :slug', { slug });
            if (category_id) queryBuilder.andWhere('category.id = :category_id', { category_id });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((page_index - 1) * page_size)
                    .limit(page_size)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const data = entities.map((entity) => new ListProductDto(entity));

            const pageResult = new PageBase(page_index, page_size, totalItems, data);
            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách sản phẩm theo tìm kiếm.');
            logger.error(error.stack);
            return null;
        }
    }
}
