import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingMailModule } from '../cms/setting_mail/setting_mail.module';
import { SettingMailService } from '../cms/setting_mail/setting_mail.service';
import { ContentMails } from '../../entity/content_mails.entity';
import { SettingMails } from '../../entity/setting_mails.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([SettingMails, ContentMails]),
        MailerModule.forRootAsync({
            imports: [SettingMailModule],
            inject: [SettingMailService],
            useFactory: async (settingMailService: SettingMailService) => {
                const mailConfig = await settingMailService.getSettingMail();
                return {
                    transport: {
                        host: mailConfig.host,
                        port: mailConfig.port,
                        secure: mailConfig.secure === 1 ? true : false,
                        auth: {
                            user: mailConfig.user,
                            pass: mailConfig.pass,
                        },
                    },
                    defaults: {
                        from: `"No Reply" < ${mailConfig.address} >`,
                    },
                    template: {
                        dir: join(__dirname, 'templates'),
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
        }),
    ],
})
export class SendMailModule { }
