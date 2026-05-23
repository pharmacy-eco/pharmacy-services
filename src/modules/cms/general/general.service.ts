import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import logger from '../../../common/logger';
import { UpdateGeneralDto } from './dto/update-one-general.dto';
import { General } from '../../../entity/general.entity';

@Injectable({ scope: Scope.REQUEST })
export class GeneralService {
    constructor(
        @InjectRepository(General)
        private generalRepository: Repository<General>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findOne() {
        try {
            return await this.generalRepository.createQueryBuilder('general').getOne();
        } catch (error) {
            logger.error('Lỗi lấy chi tiết.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdateGeneralDto) {
        try {
            const dataDetail = await this.generalRepository.findOne({
                where: { id: id },
            });
            if (!dataDetail) {
                logger.error(`Không tìm thấy cấu hình mail với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy cấu hình với ID ${id}`);
            }

            const updated = plainToClass(General, {
                ...dataDetail,
                ...dataDto,
            });

            const saveData = await this.generalRepository.save(updated);

            return saveData;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID cấu hình "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật cấu hình.');
                logger.error(error.stack);
            }
            return null;
        }
    }
}
