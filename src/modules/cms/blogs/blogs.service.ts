import { Inject, Injectable, Scope, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { Blogs } from '../../../entity/blogs.entity';
import { FilterBlogsDto } from './dto/filter-blogs.dto';
import { BlogsListDto } from './dto/list-blogs.dto';
import { CreateBlogsDto } from './dto/create-blogs.dto';
import { UpdateBlogsDto } from './dto/update-blogs.dto';
import { formatSlug } from '../../../utils/toslug.util';

@Injectable({ scope: Scope.REQUEST })
export class BlogsService {
    constructor(
        @InjectRepository(Blogs)
        private blogRepository: Repository<Blogs>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}
    async findAll(payload: FilterBlogsDto) {
        try {
            const { title, status, pageIndex = 1, pageSize = 20, sort } = payload;

            const queryBuilder = this.blogRepository.createQueryBuilder('blogs');

            if (sort) {
                queryBuilder.orderBy(`blogs.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy(`blogs.id`, 'DESC');
            }

            if (title) queryBuilder.andWhere('blogs.title LIKE :title', { title: `%${title}%` });

            if (status) queryBuilder.andWhere('blogs.status = :status', { status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const data = entities.map((cat) => new BlogsListDto(cat));

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
            return await this.blogRepository.findOne({
                where: { id },
            });
        } catch (error) {
            logger.error('Lỗi lấy chi tiết');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreateBlogsDto) {
        try {
            const currentUser = this.request.user;
            const slug = formatSlug(createNewDto.title);

            const newPayload = plainToClass(Blogs, {
                ...createNewDto,
                slug: slug,
                created_by: currentUser?.id,
                updated_by: currentUser?.id,
            });

            const savedData = await this.blogRepository.save(newPayload);

            return savedData;
        } catch (error) {
            logger.error('Lỗi khi tạo mới.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, updateDto: UpdateBlogsDto) {
        try {
            const currentUser = this.request.user;
            const oneData = await this.blogRepository.findOne({ where: { id } });
            if (!oneData) {
                throw new NotFoundException(`Không tìm thấy dữ liệu với ID ${id}`);
            }
            const slug = formatSlug(updateDto.title);
            const updatedPayload = plainToClass(Blogs, {
                ...oneData,
                ...updateDto,
                slug: slug,
                updated_by: currentUser?.id,
            });
            const savedData = await this.blogRepository.save(updatedPayload);
            return savedData;
        } catch (error) {
            logger.error('Lỗi khi cập nhật.');
            logger.error(error.stack);
            return null;
        }
    }

    async delete(id: number) {
        try {
            await this.blogRepository.delete(id);
        } catch (error) {
            logger.error('Lỗi khi xóa.');
            logger.error(error.stack);
            return null;
        }
    }
}
