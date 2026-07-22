import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { Products } from '../../../entity/products.entity';
import { Reviews } from '../../../entity/reviews.entity';
import { Categories } from '../../../entity/categories.entity';
import { PageBase } from '../../../common/response/response-page-base';
import { FilterProductsByCategoryDto, ProductCategorySortBy } from './DTO/filter-products-by-category.dto';
import { IProductListItem, IProductsByCategoryResponse } from './interfaces/product-list-response.interface';

@Injectable({ scope: Scope.REQUEST })
export class ProductsService {
    constructor(
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
        @InjectRepository(Reviews)
        private reviewsRepository: Repository<Reviews>,
        @InjectRepository(Categories)
        private categoriesRepository: Repository<Categories>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findByCategory(
        categorySlug: string,
        payload: FilterProductsByCategoryDto,
    ): Promise<IProductsByCategoryResponse | undefined | null> {
        try {
            const category = await this.categoriesRepository.findOne({
                where: { slug: categorySlug, status: 1, type: 'PRODUCT' },
                select: ['id', 'name', 'slug'],
            });

            if (!category) return undefined;

            const { keyword, min_price, max_price, page_index = 1, page_size = 20, sort_by } = payload;
            const queryBuilder = this.productsRepository
                .createQueryBuilder('product')
                .innerJoin('product.category', 'filterCategory', 'filterCategory.id = :categoryId', {
                    categoryId: category.id,
                })
                .leftJoinAndSelect('product.productImage', 'productImage', 'productImage.is_thumbnail = :isThumbnail', {
                    isThumbnail: 1,
                })
                .leftJoinAndSelect('product.category', 'category')
                .select([
                    'product.id',
                    'product.name',
                    'product.meta_name',
                    'product.slug',
                    'product.unit',
                    'product.optionals',
                    'product.price',
                    'product.current_price',
                    'productImage.id',
                    'productImage.url',
                    'category.id',
                    'category.name',
                    'category.slug',
                ])
                .where('product.status = :status', { status: 1 })
                .distinct(true);

            if (keyword) {
                queryBuilder.andWhere('product.name LIKE :keyword', { keyword: `%${keyword.trim()}%` });
            }

            if (min_price !== undefined) {
                queryBuilder.andWhere('product.current_price >= :minPrice', { minPrice: min_price });
            }

            if (max_price !== undefined) {
                queryBuilder.andWhere('product.current_price <= :maxPrice', { maxPrice: max_price });
            }

            switch (sort_by) {
                case ProductCategorySortBy.PRICE_ASC:
                    queryBuilder.orderBy('product.current_price', 'ASC');
                    break;
                case ProductCategorySortBy.PRICE_DESC:
                    queryBuilder.orderBy('product.current_price', 'DESC');
                    break;
                case ProductCategorySortBy.NAME_ASC:
                    queryBuilder.orderBy('product.name', 'ASC');
                    break;
                case ProductCategorySortBy.NAME_DESC:
                    queryBuilder.orderBy('product.name', 'DESC');
                    break;
                case ProductCategorySortBy.NEWEST:
                default:
                    queryBuilder.orderBy('product.id', 'DESC');
                    break;
            }

            const [totalItems, entities] = await Promise.all([
                queryBuilder.clone().getCount(),
                queryBuilder
                    .skip((page_index - 1) * page_size)
                    .take(page_size)
                    .getMany(),
            ]);

            const items: IProductListItem[] = entities.map((product) => ({
                id: product.id,
                name: product.name,
                meta_name: product.meta_name,
                slug: product.slug,
                unit: product.unit,
                optionals: product.optionals,
                price: product.price,
                current_price: product.current_price,
                thumbnail: product.productImage?.[0]?.url ?? '',
                categories: (product.category ?? []).map((item) => ({
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                })),
            }));

            return {
                category: { id: category.id, name: category.name, slug: category.slug },
                ...new PageBase(page_index, page_size, totalItems, items),
            };
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách sản phẩm theo danh mục.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(slug: string) {
        try {
            const product = await this.productsRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.productImage', 'productImage')
                .leftJoinAndSelect('product.category', 'category')
                .select([
                    'product.id',
                    'product.name',
                    'product.price',
                    'product.current_price',
                    'product.optionals',
                    'product.meta_name',
                    'product.meta_description',
                    'product.content',
                    'product.slug',
                    'product.unit',
                    'product.created_at',
                    'productImage.id',
                    'productImage.url',
                    'category.id',
                    'category.name',
                    'category.slug',
                ])
                .where('product.slug = :slug', { slug: slug })
                .andWhere('product.status = :status', { status: 1 })
                .getOne();

            const reviews = await this.reviewsRepository.find({
                where: { status: 1, product_id: product.id },
                select: ['id', 'name', 'star', 'content', 'created_at'],
            });

            const productRecomment = await this.productsRepository
                .createQueryBuilder('product')
                .leftJoinAndSelect('product.productImage', 'productImage', 'productImage.is_thumbnail = :isThumbnail', {
                    isThumbnail: 1,
                })
                .select([
                    'product.id AS id',
                    'product.name AS name',
                    'product.meta_name AS meta_name',
                    'product.slug AS slug',
                    'product.unit AS unit',
                    'product.price AS price',
                    'product.current_price AS current_price',
                    'productImage.url AS thumbnail',
                ])
                .where('product.status = :status', { status: 1 })
                .limit(10)
                .getRawMany();

            const data = {
                ...product,
                reviews: reviews,
                product_recomment: productRecomment,
            };

            return data;
        } catch (error) {
            logger.error('Lỗi khi lấy dữ liệu chi tiết sản phẩm.');
            logger.error(error.stack);
            return null;
        }
    }
}
