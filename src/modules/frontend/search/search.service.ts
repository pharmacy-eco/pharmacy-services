import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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
                .leftJoinAndSelect('product.productionBatch', 'productionBatch')
                .select([
                    'product.id',
                    'product.name',
                    'product.meta_name',
                    'product.meta_description',
                    'product.slug',
                    'product.unit',
                    'product.description',
                    'product.content',
                    'product.optionals',
                    'product.price',
                    'product.current_price',
                    'product.is_hot',
                    'product.status',
                    'product.production_batch_id',
                    'product.created_at',
                    'product.updated_at',
                    'productImage.id',
                    'productImage.url',
                    'productImage.is_thumbnail',
                    'category.id',
                    'category.name',
                    'category.slug',
                    'productionBatch.id',
                    'productionBatch.name',
                    'productionBatch.manufacturing_date',
                    'productionBatch.expiration_date',
                    'productionBatch.quantity',
                    'productionBatch.production_place',
                    'productionBatch.status',
                ])
                .where('product.status = :status', { status: 1 })
                .distinct(true);

            if (sort) {
                queryBuilder.orderBy(`product.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy(`product.id`, 'DESC');
            }

            if (keyword) {
                queryBuilder.andWhere(
                    new Brackets((qb) => {
                        qb.where('product.name LIKE :keyword', { keyword: `%${keyword}%` }).orWhere(
                            'product.description LIKE :keyword',
                            { keyword: `%${keyword}%` },
                        );
                    }),
                );
            }

            if (slug) queryBuilder.andWhere('category.slug = :slug', { slug });
            if (category_id) queryBuilder.andWhere('category.id = :category_id', { category_id });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .skip((page_index - 1) * page_size)
                    .take(page_size)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const data = entities.map((entity) => new ListProductDto(entity));

            const pageResult = new PageBase(page_index, page_size, totalItems, data);
            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách sản phẩm theo tìm kiếm.');
            logger.error(error);
            return null;
        }
    }
}
