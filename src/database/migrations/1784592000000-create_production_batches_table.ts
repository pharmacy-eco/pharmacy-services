import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductionBatchesTable1784592000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE production_batches (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                manufacturing_date DATE NOT NULL,
                expiration_date DATE NOT NULL,
                quantity INT NOT NULL,
                production_place VARCHAR(255) NOT NULL,
                status INT NOT NULL DEFAULT 2,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                created_by INT NULL,
                updated_by INT NULL,
                deleted_by INT NULL
            );
        `);

        await queryRunner.query(`
            ALTER TABLE products
            ADD COLUMN production_batch_id BIGINT UNSIGNED NULL
        `);

        await queryRunner.query(`
            ALTER TABLE products
            ADD CONSTRAINT FK_products_production_batch_id
            FOREIGN KEY (production_batch_id) REFERENCES production_batches(id)
            ON DELETE SET NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE products DROP FOREIGN KEY FK_products_production_batch_id`);
        await queryRunner.query(`ALTER TABLE products DROP COLUMN production_batch_id`);
        await queryRunner.query(`DROP TABLE production_batches`);
    }
}
