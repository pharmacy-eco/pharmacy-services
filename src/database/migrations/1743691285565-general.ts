import { MigrationInterface, QueryRunner } from 'typeorm';

export class General1743691285565 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE general (
                id INT AUTO_INCREMENT PRIMARY KEY,
                company VARCHAR(255) NULL,
                link_map TEXT NULL,
                iframe_map TEXT NULL,
                info TEXT NULL,
                link VARCHAR(255) NULL,
                hotline VARCHAR(255) NULL,
                address TEXT NULL,
                email VARCHAR(255) NULL,
                logo VARCHAR(255) NULL,
                favicon VARCHAR(255) NULL,
                social JSON NULL,
                add_body TEXT NULL,
                add_header TEXT NULL,
                meta_title VARCHAR(255) NULL,
                meta_keyword VARCHAR(255) NULL,
                meta_description TEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "general"`);
    }
}
