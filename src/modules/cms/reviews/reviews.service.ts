import { Inject, Injectable, Scope, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { FilterReviewsDto } from './dto/filter-reviews.dto';
import { Reviews } from '../../../entity/reviews.entity';
import { ReviewsListDto } from './dto/list-reviews.dto';
import { CreateReviewsDto } from './dto/create-reviews.dto';

@Injectable({ scope: Scope.REQUEST })
export class ReviewsService {
    constructor(
        @InjectRepository(Reviews)
        private reviewsRepository: Repository<Reviews>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}
    async findAll(payload: FilterReviewsDto) {
        try {
            const { name, product_id, status, pageIndex = 1, pageSize = 20, sort } = payload;

            const queryBuilder = this.reviewsRepository
                .createQueryBuilder('reviews')
                .leftJoinAndSelect('reviews.product', 'product');

            if (sort) {
                const sortFieldMap = {
                    id: 'reviews.id',
                    name: 'reviews.name',
                    product_name: 'product.name',
                    star: 'reviews.star',
                    status: 'reviews.status',
                    created_at: 'reviews.created_at',
                };
                queryBuilder.orderBy(
                    sortFieldMap[sort.field] || 'reviews.id',
                    sort.order.toUpperCase() as 'ASC' | 'DESC',
                );
            } else {
                queryBuilder.orderBy(`reviews.id`, 'DESC');
            }

            if (name) queryBuilder.andWhere('reviews.name LIKE :name', { name: `%${name}%` });

            if (product_id) queryBuilder.andWhere('reviews.product_id = :product_id', { product_id });

            if (status) queryBuilder.andWhere('reviews.status = :status', { status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const data = entities.map((cat) => new ReviewsListDto(cat));

            const pageResult = new PageBase(pageIndex, pageSize, totalItems, data);
            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            const review = await this.reviewsRepository
                .createQueryBuilder('reviews')
                .leftJoinAndSelect('reviews.product', 'product')
                .where('reviews.id = :id', { id })
                .getOne();

            return review ? new ReviewsListDto(review) : null;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreateReviewsDto) {
        try {
            const currentUser = this.request.user;

            const newPayload = plainToClass(Reviews, {
                ...createNewDto,
                created_by: currentUser?.id,
            });

            const savedData = await this.reviewsRepository.save(newPayload);

            return savedData;
        } catch (error) {
            logger.error('Lỗi khi tạo mới.');
            logger.error(error.stack);
            return null;
        }
    }

    async delete(id: number) {
        try {
            const currentUser = this.request.user;
            const oneData = await this.reviewsRepository.findOne({ where: { id } });
            if (!oneData) {
                throw new NotFoundException(`Không tìm thấy dữ liệu với ID ${id}`);
            }

            const dataUpdate = plainToClass(Reviews, {
                ...oneData,
                status: 2,
                deleted_by: currentUser?.id,
            });
            await this.reviewsRepository.save(dataUpdate);
        } catch (error) {
            logger.error('Lỗi khi xóa.');
            logger.error(error.stack);
            return null;
        }
    }
}
