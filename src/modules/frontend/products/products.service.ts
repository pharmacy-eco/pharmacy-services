import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { Products } from '../../../entity/products.entity';
import { Reviews } from '../../../entity/reviews.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProductsService {
    constructor(
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
        @InjectRepository(Reviews)
        private reviewsRepository: Repository<Reviews>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

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
