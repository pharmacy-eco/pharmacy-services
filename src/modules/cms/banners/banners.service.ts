import { Inject, Injectable, Scope, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { Banners } from '../../../entity/banners.entity';
import { FilterBannersDto } from './dto/filter-banners.dto';
import { CreateBannersDto } from './dto/create-banners.dto';
import { UpdateBannersDto } from './dto/update-banners.dto';
import { BannersListDto } from './dto/list-banners.dto';

@Injectable({ scope: Scope.REQUEST })
export class BannersService {
    constructor(
        @InjectRepository(Banners)
        private bannersRepository: Repository<Banners>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}
    async findAll(payload: FilterBannersDto) {
        try {
            const { title, status, pageIndex = 1, pageSize = 20, sort } = payload;

            const queryBuilder = this.bannersRepository.createQueryBuilder('banners');

            if (sort) {
                queryBuilder.orderBy(`banners.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy(`banners.id`, 'DESC');
            }

            if (title) queryBuilder.andWhere('banners.title LIKE :title', { title: `%${title}%` });

            if (status) queryBuilder.andWhere('banners.status = :status', { status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const data = entities.map((cat) => new BannersListDto(cat));

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
            return await this.bannersRepository.findOne({
                where: { id },
            });
        } catch (error) {
            logger.error('Lỗi lấy chi tiết');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreateBannersDto) {
        try {
            const currentUser = this.request.user;

            const newPayload = plainToClass(Banners, {
                ...createNewDto,
                created_by: currentUser?.id,
                updated_by: currentUser?.id,
            });

            const savedData = await this.bannersRepository.save(newPayload);

            return savedData;
        } catch (error) {
            logger.error('Lỗi khi tạo mới.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, updateDto: UpdateBannersDto) {
        try {
            const oneData = await this.bannersRepository.findOne({ where: { id } });
            if (!oneData) {
                throw new NotFoundException(`Không tìm thấy dữ liệu với ID ${id}`);
            }
            const updatedPayload = plainToClass(Banners, { ...oneData, ...updateDto });
            const savedData = await this.bannersRepository.save(updatedPayload);
            return savedData;
        } catch (error) {
            logger.error('Lỗi khi cập nhật.');
            logger.error(error.stack);
            return null;
        }
    }

    async delete(id: number) {
        try {
            await this.bannersRepository.delete(id);
        } catch (error) {
            logger.error('Lỗi khi xóa.');
            logger.error(error.stack);
            return null;
        }
    }
}
