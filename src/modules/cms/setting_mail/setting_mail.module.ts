import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { SettingMailController } from './setting_mail.controller';
import { SettingMailService } from './setting_mail.service';
import { SettingMails } from '../../../entity/setting_mails.entity';
import { ContentMails } from '../../../entity/content_mails.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SettingMails, ContentMails])],
    controllers: [SettingMailController],
    providers: [SettingMailService, ResponseService],
    exports: [SettingMailService],
})
export class SettingMailModule {}
