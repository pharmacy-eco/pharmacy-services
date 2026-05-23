import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsImageTable1744293560520 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE products_image (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                url VARCHAR(255) NOT NULL,
                product_id INT NOT NULL,
                is_thumbnail INT NOT NULL DEFAULT 2,
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
        await queryRunner.query(`DROP TABLE products_image`);
    }
}
