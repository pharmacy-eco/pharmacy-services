import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsTable1744293382810 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE products (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL,
                price INT NOT NULL,
                current_price INT NOT NULL,
                category_id INT NOT NULL,
                description TEXT NULL,
                content TEXT NULL,
                is_hot INT NULL DEFAULT 0,
                status INT NOT NULL,
                meta_name VARCHAR(255) NOT NULL,
                meta_description TEXT NULL,
                optionals JSON NULL,
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
        await queryRunner.query(`DROP TABLE products`);
    }
}
