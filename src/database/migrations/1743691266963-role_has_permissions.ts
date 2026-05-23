import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleHasPermissions1743691266963 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE role_has_permissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            role_id INT NOT NULL,
            permission_id INT NOT NULL,
            CONSTRAINT fk_roles FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
            CONSTRAINT fk_permissions FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "role_has_permissions"`);
    }
}
