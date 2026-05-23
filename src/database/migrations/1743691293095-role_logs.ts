import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleLogs1743691293095 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE role_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                action VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by INT NOT NULL
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "role_logs"`);
    }
}
