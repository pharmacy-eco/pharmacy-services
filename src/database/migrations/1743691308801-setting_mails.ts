import { MigrationInterface, QueryRunner } from 'typeorm';

export class SettingMails1743691308801 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE setting_mails (
                id INT AUTO_INCREMENT PRIMARY KEY,
                host VARCHAR(255) NOT NULL,
                port INT NOT NULL,
                secure INT NOT NULL,
                user VARCHAR(255) NOT NULL,
                pass VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "setting_mails"`);
    }
}
