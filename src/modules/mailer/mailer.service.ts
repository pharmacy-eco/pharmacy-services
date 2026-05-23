import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface IContextForgotPass {
    token: string;
    domain: string;
}

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendUserConfirmation(userEmail: string, contextData: IContextForgotPass) {
        await this.mailerService.sendMail({
            to: userEmail,
            subject: 'Xác nhận quên mật khẩu',
            template: './resetPass',
            context: {
                token: contextData.token,
                domain: contextData.domain + '/mat-khau-moi',
            },
        });
    }

    async sendUserConnfirmMail(userEmail: string, contextData: IContextForgotPass) {
        await this.mailerService.sendMail({
            to: userEmail,
            subject: 'Xác nhận email',
            template: './confirmationMail',
            context: {
                token: contextData.token,
                domain: contextData.domain + '/confirmation',
            },
        });
    }
}
