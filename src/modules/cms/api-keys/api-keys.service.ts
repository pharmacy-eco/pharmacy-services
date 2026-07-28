import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { ApiKeys } from '../../../entity/api_keys.entity';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { FilterApiKeyDto } from './dto/filter-api-key.dto';
import { ApiKeyListDto } from './dto/list-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';

@Injectable({ scope: Scope.REQUEST })
export class ApiKeysService {
    constructor(
        @InjectRepository(ApiKeys)
        private apiKeysRepository: Repository<ApiKeys>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: FilterApiKeyDto) {
        try {
            const { keyword, status, pageIndex = 1, pageSize = 20, sort } = payload;
            const queryBuilder = this.apiKeysRepository.createQueryBuilder('api_keys');

            if (sort) {
                queryBuilder.orderBy(`api_keys.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy('api_keys.id', 'DESC');
            }

            if (keyword) queryBuilder.andWhere('api_keys.name LIKE :keyword', { keyword: `%${keyword}%` });
            if (status) queryBuilder.andWhere('api_keys.status = :status', { status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const data = entities.map((apiKey) => new ApiKeyListDto(apiKey));
            return new PageBase(pageIndex, pageSize, totalItems, data);
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách API key.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            const apiKey = await this.apiKeysRepository.findOne({ where: { id } });
            return apiKey ? new ApiKeyListDto(apiKey) : null;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết API key.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createDto: CreateApiKeyDto) {
        try {
            const currentUser = this.request.user;
            const newPayload = plainToClass(ApiKeys, {
                ...createDto,
                model: createDto.model || 'gemini-3.6-flash',
                token_quota: createDto.token_quota || 0,
                token_used: 0,
                created_by: currentUser?.id,
                updated_by: currentUser?.id,
            });

            const savedApiKey = await this.apiKeysRepository.save(newPayload);
            return new ApiKeyListDto(savedApiKey);
        } catch (error) {
            logger.error('Lỗi khi tạo mới API key.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, updateDto: UpdateApiKeyDto) {
        try {
            const currentUser = this.request.user;
            const apiKey = await this.apiKeysRepository.findOne({ where: { id } });
            if (!apiKey) {
                throw new NotFoundException(`Không tìm thấy API key với ID ${id}`);
            }

            const updatePayload = plainToClass(ApiKeys, {
                ...apiKey,
                ...updateDto,
                api_key: updateDto.api_key || apiKey.api_key,
                model: updateDto.model || apiKey.model || 'gemini-3.6-flash',
                updated_by: currentUser?.id,
            });

            const savedApiKey = await this.apiKeysRepository.save(updatePayload);
            return new ApiKeyListDto(savedApiKey);
        } catch (error) {
            logger.error('Lỗi khi cập nhật API key.');
            logger.error(error.stack);
            return null;
        }
    }

    async resetTokenUsed(id: number) {
        try {
            const currentUser = this.request.user;
            const apiKey = await this.apiKeysRepository.findOne({ where: { id } });
            if (!apiKey) {
                throw new NotFoundException(`Không tìm thấy API key với ID ${id}`);
            }

            apiKey.token_used = 0;
            apiKey.updated_by = currentUser?.id;

            const savedApiKey = await this.apiKeysRepository.save(apiKey);
            return new ApiKeyListDto(savedApiKey);
        } catch (error) {
            logger.error('Lỗi khi reset token API key.');
            logger.error(error.stack);
            return null;
        }
    }

    async delete(id: number) {
        try {
            await this.apiKeysRepository.delete(id);
        } catch (error) {
            logger.error('Lỗi khi xóa API key.');
            logger.error(error.stack);
            return null;
        }
    }
}
