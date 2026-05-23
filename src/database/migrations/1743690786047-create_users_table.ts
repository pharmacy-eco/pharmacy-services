import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1743690786047 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(255) NOT NULL,
                fullname VARCHAR(255) NOT NULL,
                verify_at TIMESTAMP NULL DEFAULT NULL,
                password VARCHAR(255) NOT NULL,
                gender INT NOT NULL,
                avatar VARCHAR(255) NOT NULL,
                address TEXT NULL,
                role_id VARCHAR(255) NOT NULL,
                status INT NOT NULL,
                username VARCHAR(255) NOT NULL,
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
        await queryRunner.query(`DROP TABLE users`);
    }
}
