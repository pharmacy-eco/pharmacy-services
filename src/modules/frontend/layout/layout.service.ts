import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { General } from '../../../entity/general.entity';
import { Categories } from '../../../entity/categories.entity';
import { Products } from '../../../entity/products.entity';
import { Blogs } from '../../../entity/blogs.entity';
import { Banners } from '../../../entity/banners.entity';

@Injectable({ scope: Scope.REQUEST })
export class LayoutService {
    constructor(
        @InjectRepository(General)
        private generalRepository: Repository<General>,
        @InjectRepository(Categories)
        private categoriesRepository: Repository<Categories>,
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
        @InjectRepository(Blogs)
        private blogsRepository: Repository<Blogs>,
        @InjectRepository(Banners)
        private bannersRepository: Repository<Banners>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findLaypout() {
        try {
            const general = await this.generalRepository.find();
            const categories = await this.categoriesRepository.find({
                where: { status: 1, type: 'PRODUCT' },
                select: ['id', 'image', 'slug', 'name', 'meta_name', 'type', 'parent_id'],
            });
            const categoriesBlog = await this.blogsRepository.find({
                where: { status: 1 },
                select: ['id', 'title', 'slug'],
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dataMap = new Map<number, any>();
            categories.forEach((per) => {
                dataMap.set(per.id, { ...per, children: [] });
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tree: any[] = [];

            dataMap.forEach((item) => {
                if (item.parent_id) {
                    const parent = dataMap.get(item.parent_id);
                    if (parent) {
                        parent.children.push(item);
                    }
                } else {
                    tree.push(item);
                }
            });

            const data = {
                general: general,
                categories: {
                    categories_blog: categoriesBlog,
                    categories_products: tree,
                },
            };

            return data;
        } catch (error) {
            logger.error('Lỗi khi lấy dữ liệu layout.');
            logger.error(error.stack);
            return null;
        }
    }

    async findHome() {
        try {
            const products = await this.productsRepository
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
                    'product.optionals AS optionals',
                    'product.price AS price',
                    'product.current_price AS current_price',
                    'productImage.url AS thumbnail',
                ])
                .where('product.status = :status', { status: 1 })
                .andWhere('product.is_hot = :is_hot', { is_hot: 1 })
                .limit(12)
                .getRawMany();
            const banner = await this.bannersRepository.find({
                where: { status: 1 },
                select: ['id', 'title', 'position', 'image', 'url', 'is_slider'],
            });

            const blogs = await this.blogsRepository.find({
                select: ['id', 'slug', 'meta_title', 'meta_description', 'description', 'title', 'image'],
                where: { status: 1 },
                order: { id: 'DESC' },
                take: 4,
            });

            const category = await this.categoriesRepository
                .createQueryBuilder('categories')
                .leftJoin('categories.product', 'product')
                .where('categories.is_hot = :isHot', { isHot: 1 })
                .loadRelationCountAndMap('categories.productCount', 'categories.product')
                .getMany();

            const brands = await this.categoriesRepository.find({
                select: ['id', 'image', 'name', 'meta_name', 'slug'],
                where: { status: 1, type: 'BRAND' },
            });
            const data = {
                product: products,
                banner: banner,
                blogs: blogs,
                brands: brands,
                category: category,
            };
            return data;
        } catch (error) {
            logger.error('Lỗi khi lấy dữ liệu trang chủ.');
            logger.error(error.stack);
            return null;
        }
    }

    async findAbout() {
        try {
            const categories = await this.categoriesRepository.find({
                where: { status: 1, type: 'BLOG' },
                select: ['id', 'image', 'slug', 'name', 'meta_name', 'type'],
            });

            const whereCondition: IConditionAboutWhere = { status: 1 };

            if (categories.length > 0) {
                whereCondition.category_id = categories[0].id;
            }
            const blog = await this.blogsRepository.findOne({
                where: whereCondition,
                select: ['id', 'content', 'description', 'meta_description', 'meta_title', 'slug'],
            });
            const data = {
                categories: categories,
                blog: blog,
            };
            return data;
        } catch (error) {
            logger.error('Lỗi khi lấy dữ liệu trang giới thiệu.');
            logger.error(error.stack);
            return null;
        }
    }
}

interface IConditionAboutWhere {
    status: number;
    category_id?: number;
}
