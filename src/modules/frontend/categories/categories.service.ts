import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { Categories } from '../../../entity/categories.entity';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { IFeaturedCategory } from './interfaces/featured-category-response.interface';

@Injectable({ scope: Scope.REQUEST })
export class CategoriesService {
    constructor(
        @InjectRepository(Categories)
        private categoriesRepository: Repository<Categories>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findFeatured(): Promise<IFeaturedCategory[] | null> {
        try {
            const categories = await this.categoriesRepository
                .createQueryBuilder('category')
                .select(['category.id', 'category.name', 'category.slug', 'category.image', 'category.meta_name'])
                .where('category.status = :status', { status: 1 })
                .andWhere('category.type = :type', { type: 'PRODUCT' })
                .andWhere('category.is_hot = :isHot', { isHot: 1 })
                .loadRelationCountAndMap('category.product_count', 'category.product', 'activeProduct', (countQuery) =>
                    countQuery.andWhere('activeProduct.status = :activeProductStatus'),
                )
                .setParameter('activeProductStatus', 1)
                .orderBy('category.id', 'DESC')
                .getMany();

            return categories.map((category: Categories & { product_count: number }) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                image: category.image,
                meta_name: category.meta_name,
                product_count: category.product_count ?? 0,
            }));
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách danh mục nổi bật.');
            logger.error(error.stack);
            return null;
        }
    }
}
