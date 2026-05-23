import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlogTable1744293191174 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE blog (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL,
                category_id INT NOT NULL,
                description TEXT NULL,
                content TEXT NULL,
                status INT NOT NULL,
                meta_title VARCHAR(255) NOT NULL,
                meta_description TEXT NULL,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                created_by INT NULL,
                updated_by INT NULL,
                deleted_by INT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE blog`);
    }
}
