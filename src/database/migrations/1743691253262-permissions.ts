import { MigrationInterface, QueryRunner } from 'typeorm';

export class Permissions1743691253262 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE permissions (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              code VARCHAR(255) NOT NULL,
              slug VARCHAR(255) NOT NULL,
              parent_id INT NULL,
              status INT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              created_by INT NULL,
              updated_by INT NULL,
              CONSTRAINT fk_permissions_parent FOREIGN KEY (parent_id) REFERENCES permissions(id) ON DELETE SET NULL
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "permissions"`);
    }
}
