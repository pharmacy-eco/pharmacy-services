import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ContentMails } from './content_mails.entity';

@Entity()
export class SettingMails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    host: string;

    @Column()
    port: number;

    @Column()
    secure: number;

    @Column()
    user: string;

    @Column()
    pass: string;

    @Column()
    address: string;

    @OneToMany(() => ContentMails, (contentMail) => contentMail.settingMail)
    contentMail: ContentMails[];
}
