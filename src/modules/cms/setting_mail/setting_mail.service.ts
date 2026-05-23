import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { UpdateSettingMailDto } from './dto/update-one-setting_mail.dto';
import { SettingMails } from '../../../entity/setting_mails.entity';
import { ContentMails } from '../../../entity/content_mails.entity';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import logger from '../../../common/logger';

@Injectable({ scope: Scope.REQUEST })
export class SettingMailService {
    constructor(
        @InjectRepository(SettingMails)
        private settingMailRepository: Repository<SettingMails>,
        @InjectRepository(ContentMails)
        private contentMailRepository: Repository<ContentMails>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findSettingMail() {
        try {
            const entity = await this.settingMailRepository
                .createQueryBuilder('setting_mail')
                .leftJoinAndSelect('setting_mail.contentMail', 'contentMail')
                .getOne();
            const entityData = {
                ...entity,
                secure: entity.secure && entity.secure === 1 ? true : false,
                contentMail: entity.contentMail.reduce((acc, item) => {
                    acc[item.type_code] = item;
                    return acc;
                }, {}),
            };
            return entityData;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết cấu hình email.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdateSettingMailDto) {
        try {
            const dataDetail = await this.settingMailRepository.findOne({
                where: { id: id },
                relations: ['contentMail'],
            });
            if (!dataDetail) {
                logger.error(`Không tìm thấy cấu hình mail với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy cấu hình mail với ID ${id}`);
            }

            const updated = plainToClass(SettingMails, {
                ...dataDetail,
                host: dataDto.host,
                pass: dataDto.pass,
                port: dataDto.port,
                user: dataDto.user,
                address: dataDto.address,
                secure: dataDto.secure ? 1 : 2,
            });

            const saveSettingMail = await this.settingMailRepository.save(updated);

            const dataRESEPASS = saveSettingMail.contentMail.find((content) => content.type_code === 'RESETPASS');
            const updateRESETPASS = plainToClass(ContentMails, {
                ...dataRESEPASS,
                ...dataDto.RESETPASS,
            });

            const dataCONFIRM = saveSettingMail.contentMail.find((content) => content.type_code === 'CONFIRM');
            const updateCONFIRM = plainToClass(ContentMails, {
                ...dataCONFIRM,
                ...dataDto.CONFIRM,
            });

            const dataPAYMENT = saveSettingMail.contentMail.find((content) => content.type_code === 'PAYMENT');
            const updatePAYMENT = plainToClass(ContentMails, {
                ...dataPAYMENT,
                ...dataDto.PAYMENT,
            });

            await this.contentMailRepository.save([updateRESETPASS, updateCONFIRM, updatePAYMENT]);

            return saveSettingMail;
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

    async getSettingMail() {
        try {
            const entity = await this.settingMailRepository.createQueryBuilder('setting_mail').getOne();
            return entity;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết cấu hình email.');
            logger.error(error.stack);
            return null;
        }
    }
}
