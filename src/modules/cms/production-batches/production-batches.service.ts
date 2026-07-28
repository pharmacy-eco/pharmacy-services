import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { ProductionBatches } from '../../../entity/production_batches.entity';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { FilterProductionBatchDto } from './dto/filter-production-batch.dto';
import { ProductionBatchListDto } from './dto/list-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProductionBatchesService {
    constructor(
        @InjectRepository(ProductionBatches)
        private productionBatchesRepository: Repository<ProductionBatches>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: FilterProductionBatchDto) {
        try {
            const { name, status, pageIndex = 1, pageSize = 20, sort } = payload;
            const queryBuilder = this.productionBatchesRepository.createQueryBuilder('production_batches');

            if (sort) {
                queryBuilder.orderBy(`production_batches.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy('production_batches.id', 'DESC');
            }

            if (name) queryBuilder.andWhere('production_batches.name LIKE :name', { name: `%${name}%` });

            if (status) queryBuilder.andWhere('production_batches.status = :status', { status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const data = entities.map((batch) => new ProductionBatchListDto(batch));
            return new PageBase(pageIndex, pageSize, totalItems, data);
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách lô sản xuất.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            return await this.productionBatchesRepository.findOne({ where: { id } });
        } catch (error) {
            logger.error('Lỗi lấy chi tiết lô sản xuất.');
            logger.error(error.stack);
            return null;
        }
    }

    async findSelectOptions() {
        try {
            const batches = await this.productionBatchesRepository.find({
                where: { status: 1 },
                order: { id: 'DESC' },
            });

            return batches.map((batch) => new ProductionBatchListDto(batch));
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách chọn lô sản xuất.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createDto: CreateProductionBatchDto) {
        try {
            const currentUser = this.request.user;
            const newPayload = plainToClass(ProductionBatches, {
                ...createDto,
                created_by: currentUser?.id,
                updated_by: currentUser?.id,
            });

            return await this.productionBatchesRepository.save(newPayload);
        } catch (error) {
            logger.error('Lỗi khi tạo mới lô sản xuất.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, updateDto: UpdateProductionBatchDto) {
        try {
            const currentUser = this.request.user;
            const batch = await this.productionBatchesRepository.findOne({ where: { id } });
            if (!batch) {
                throw new NotFoundException(`Không tìm thấy lô sản xuất với ID ${id}`);
            }

            const updatePayload = plainToClass(ProductionBatches, {
                ...batch,
                ...updateDto,
                updated_by: currentUser?.id,
            });

            return await this.productionBatchesRepository.save(updatePayload);
        } catch (error) {
            logger.error('Lỗi khi cập nhật lô sản xuất.');
            logger.error(error.stack);
            return null;
        }
    }

    async delete(id: number) {
        try {
            await this.productionBatchesRepository.delete(id);
        } catch (error) {
            logger.error('Lỗi khi xóa lô sản xuất.');
            logger.error(error.stack);
            return null;
        }
    }
}
