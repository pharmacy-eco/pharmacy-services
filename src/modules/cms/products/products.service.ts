import { Inject, Injectable, Scope, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { FilterProductsDto } from './dto/filter-products.dto';
import { ProductsListDto } from './dto/list-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { CreateProductsDto } from './dto/create-products.dto';
import { Products } from '../../../entity/products.entity';
import { ProductsImage } from '../../../entity/products_image.entity';
import { Categories } from '../../../entity/categories.entity';
import { formatSlug } from '../../../utils/toslug.util';

@Injectable({ scope: Scope.REQUEST })
export class ProductsService {
    constructor(
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
        @InjectRepository(ProductsImage)
        private poductsImageRepository: Repository<ProductsImage>,
        @InjectRepository(Categories)
        private categoriesRepository: Repository<Categories>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}
    async findAll(payload: FilterProductsDto) {
        try {
            const { name, status, pageIndex = 1, pageSize = 20, sort } = payload;

            const queryBuilder = this.productsRepository
                .createQueryBuilder('products')
                .leftJoinAndSelect('products.category', 'category')
                .leftJoinAndSelect('products.productImage', 'productImage')
                .select([
                    'products.id',
                    'products.name',
                    'products.slug',
                    'products.updated_at',
                    'products.unit',
                    'productImage.id',
                    'productImage.url',
                    'productImage.is_thumbnail',
                    'category.id',
                    'category.name',
                ]);

            queryBuilder.where('productImage.is_thumbnail = :is_thumbnail', { is_thumbnail: 1 });

            if (sort) {
                queryBuilder.orderBy(`products.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy(`products.id`, 'DESC');
            }

            if (name) queryBuilder.andWhere('products.name LIKE :name', { name: `%${name}%` });

            if (status) queryBuilder.andWhere('products.status = :status', { status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const dataCat = entities.map((cat) => new ProductsListDto(cat));

            const pageResult = new PageBase(pageIndex, pageSize, totalItems, dataCat);
            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách sản phẩm.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            let dataOne = await this.productsRepository
                .createQueryBuilder('products')
                .leftJoinAndSelect('products.productImage', 'productImage')
                .leftJoinAndSelect('products.category', 'category')
                .select(['products.*', 'productImage.id', 'productImage.url', 'category.id', 'category.name'])
                .where('products.id = :id', { id: id })
                .getRawOne();

            const optionals = JSON.parse(dataOne?.optionals);
            dataOne = {
                ...dataOne,
                optionals: optionals,
            };

            return dataOne;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết sản phẩm');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createProductsDto: CreateProductsDto) {
        const queryRunner = this.productsRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const currentUser = this.request.user;
            const images = createProductsDto.image;
            const slug = formatSlug(createProductsDto.name);

            if (!Array.isArray(images)) {
                logger.error('Lỗi khi tạo mới sản phẩm.');
                return null;
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { image, ...newProductsPayload } = createProductsDto;

            const categories = await this.categoriesRepository.find({ where: { id: In(createProductsDto.category) } });

            const newProduct = plainToClass(Products, {
                ...newProductsPayload,
                category: categories,
                slug: slug,
                // optionals: optionalsJson,
                created_by: currentUser?.id,
                updated_by: currentUser?.id,
            });

            const savedProducts = await queryRunner.manager.save(newProduct);

            const createImagePayloads = images.map((img, index) => {
                const productImage = new ProductsImage();
                productImage.created_by = currentUser?.id;
                productImage.product_id = savedProducts.id;
                productImage.url = img;
                productImage.is_thumbnail = index === 0 ? 1 : 2;
                return productImage;
            });

            await this.poductsImageRepository.save(createImagePayloads);

            await queryRunner.commitTransaction();
            return savedProducts;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            logger.error('Lỗi khi tạo mới sản phẩm.');
            logger.error(error.stack);
            return null;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, productDto: UpdateProductsDto) {
        const queryRunner = this.productsRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const currentUser = this.request.user;
            const images = productDto.image;
            const optionalsJson = JSON.stringify(productDto.optionals);

            if (!Array.isArray(images)) {
                logger.error('Lỗi khi tạo mới sản phẩm.');
                return null;
            }
            const product = await this.productsRepository.findOne({ where: { id } });
            if (!product) {
                throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${id}`);
            }

            const slug = formatSlug(productDto.name);

            const categories = await this.categoriesRepository.find({ where: { id: In(productDto.category) } });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { image, ...newProductsPayload } = productDto;

            const updateProduct = plainToClass(Products, {
                ...product,
                ...newProductsPayload,
                slug: slug,
                category: categories,
                optionals: optionalsJson,
                updated_by: currentUser?.id,
            });

            await this.poductsImageRepository.delete({ product_id: product.id });

            const savedProduct = await queryRunner.manager.save(updateProduct);

            const createImagePayloads = images.map((img, index) => {
                const productImage = new ProductsImage();
                productImage.created_by = currentUser?.id;
                productImage.product_id = savedProduct.id;
                productImage.url = img;
                productImage.is_thumbnail = index === 0 ? 1 : 2;
                return productImage;
            });

            await this.poductsImageRepository.save(createImagePayloads);

            await queryRunner.commitTransaction();

            return savedProduct;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            logger.error('Lỗi khi cập nhật category.');
            logger.error(error.stack);
            return null;
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: number) {
        try {
            await this.poductsImageRepository.delete({ product_id: id });
            await this.productsRepository.delete(id);
        } catch (error) {
            logger.error('Lỗi khi xóa sản phẩm');
            logger.error(error.stack);
            return null;
        }
    }
}
