import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBirthdayToUsers1785280000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
                ADD COLUMN birthday DATE NULL AFTER address
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE users
                DROP COLUMN birthday
        `);
    }
}
