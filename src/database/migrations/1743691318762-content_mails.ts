import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContentMails1743691318762 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE content_mails (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            type_code VARCHAR(255) NOT NULL,
            setting_mail_id INT,
            FOREIGN KEY (setting_mail_id) REFERENCES setting_mails(id) ON DELETE CASCADE
        );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "content_mails"`);
    }
}
