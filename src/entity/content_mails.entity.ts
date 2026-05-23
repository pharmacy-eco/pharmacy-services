import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SettingMails } from './setting_mails.entity';

@Entity()
export class ContentMails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    type_code: string;

    @ManyToOne(() => SettingMails, (settingMail) => settingMail.contentMail)
    settingMail: SettingMails;
}
