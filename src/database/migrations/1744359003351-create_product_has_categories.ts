import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductHasCategories1744359003351 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE products_has_categories (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                category_id INT NOT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE products_has_categories`);
    }
}
