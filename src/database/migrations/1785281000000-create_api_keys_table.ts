import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApiKeysTable1785281000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE api_keys (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                api_key VARCHAR(512) NOT NULL,
                model VARCHAR(255) NOT NULL DEFAULT 'gemini-3.6-flash',
                expires_at DATE NOT NULL,
                token_quota INT NOT NULL DEFAULT 0,
                token_used INT NOT NULL DEFAULT 0,
                status INT NOT NULL DEFAULT 1,
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
        await queryRunner.query(`DROP TABLE api_keys`);
    }
}
