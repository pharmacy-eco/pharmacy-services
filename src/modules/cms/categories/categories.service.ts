import { Inject, Injectable, Scope, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { CategoryListDto } from './dto/list-category.dto';
import { PageBase } from '../../../common/response/response-page-base';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { plainToClass } from 'class-transformer';
import { Categories } from '../../../entity/categories.entity';
import { formatSlug } from '../../../utils/toslug.util';

@Injectable({ scope: Scope.REQUEST })
export class CategoriesService {
    constructor(
        @InjectRepository(Categories)
        private categoryRepository: Repository<Categories>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}
    async findAll(payload: FilterCategoryDto) {
        try {
            const { name, status, pageIndex = 1, pageSize = 20, sort, parent_id } = payload;

            const queryBuilder = this.categoryRepository.createQueryBuilder('categories');
            queryBuilder.leftJoinAndSelect('categories.parent', 'parentCategory');

            if (sort) {
                queryBuilder.orderBy(`categories.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy(`categories.id`, 'DESC');
            }

            if (name) queryBuilder.andWhere('categories.name LIKE :name', { name: `%${name}%` });

            if (parent_id) queryBuilder.andWhere('categories.parent_id = :parent_id', { parent_id: parent_id });

            if (status) queryBuilder.andWhere('categories.status = :status', { status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const dataCat = entities.map((cat) => new CategoryListDto(cat));
            const pageResult = new PageBase(pageIndex, pageSize, totalItems, dataCat);
            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách danh mục.');
            logger.error(error);
            return null;
        }
    }

    async findAllParent() {
        try {
            const data = this.categoryRepository.find({ select: ['id', 'name'], where: { parent_id: 0 } });

            return data;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách danh mục cha.');
            logger.error(error);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            return await this.categoryRepository.findOne({
                where: { id },
            });
        } catch (error) {
            logger.error('Lỗi lấy chi tiết danh mục');
            logger.error(error);
            return null;
        }
    }

    async create(createNewCategoryDto: CreateCategoryDto) {
        try {
            const currentUser = this.request.user;
            const slug = formatSlug(createNewCategoryDto.name);

            const newCategoryWithCreatorInfo = plainToClass(Categories, {
                ...createNewCategoryDto,
                slug: slug,
                parent_id: createNewCategoryDto.parent_id || 0,
                created_by: currentUser?.id,
                updated_by: currentUser?.id,
            });

            const savedCategory = await this.categoryRepository.save(newCategoryWithCreatorInfo);
            const categoryWithoutSensitiveData = {
                ...savedCategory,
            };
            return categoryWithoutSensitiveData;
        } catch (error) {
            logger.error('Lỗi khi tạo mới danh mục.');
            logger.error(error);
            return null;
        }
    }

    async update(id: number, categoryDto: UpdateCategoryDto) {
        try {
            const currentUser = this.request.user;
            const cat = await this.categoryRepository.findOne({ where: { id } });
            if (!cat) {
                throw new NotFoundException(`Không tìm thấy category với ID ${id}`);
            }
            const slug = formatSlug(categoryDto.name);
            const updatedCat = plainToClass(Categories, {
                ...cat,
                ...categoryDto,
                slug: slug,
                updated_by: currentUser?.id,
            });
            const savedCat = await this.categoryRepository.save(updatedCat);
            return savedCat;
        } catch (error) {
            logger.error('Lỗi khi cập nhật category.');
            logger.error(error);
            return null;
        }
    }

    async delete(id: number) {
        try {
            await this.categoryRepository.delete(id);
        } catch (error) {
            logger.error('Lỗi khi xóa danh mục');
            logger.error(error);
            return null;
        }
    }
}
