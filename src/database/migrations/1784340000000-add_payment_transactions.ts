import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentTransactions1784340000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE orders
                ADD COLUMN payment_method ENUM('CASH', 'VNPAY') NOT NULL DEFAULT 'CASH',
                ADD COLUMN payment_status ENUM('PENDING', 'SUCCESS', 'FAILURE') NOT NULL DEFAULT 'PENDING'
        `);

        await queryRunner.query(`
            CREATE TABLE transactions (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                order_id BIGINT UNSIGNED NULL,
                orderCode VARCHAR(255) NOT NULL,
                paymentMethod ENUM('CASH', 'VNPAY') NOT NULL DEFAULT 'CASH',
                amount INT NOT NULL DEFAULT 0,
                payDate VARCHAR(255) NULL,
                transactionNo VARCHAR(255) NULL UNIQUE,
                transactionStatus ENUM('PENDING', 'SUCCESS', 'FAILURE') NOT NULL DEFAULT 'PENDING',
                responseCode VARCHAR(255) NULL,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_transactions_order_code (orderCode),
                INDEX idx_transactions_order_id (order_id)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE payment_history (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                order_id BIGINT UNSIGNED NULL,
                transaction_id BIGINT UNSIGNED NULL,
                orderCode VARCHAR(255) NOT NULL,
                paymentMethod ENUM('CASH', 'VNPAY') NOT NULL DEFAULT 'CASH',
                paymentStatus ENUM('PENDING', 'SUCCESS', 'FAILURE') NOT NULL DEFAULT 'PENDING',
                amount INT NOT NULL DEFAULT 0,
                bankCode VARCHAR(255) NULL,
                bankTranNo VARCHAR(255) NULL,
                cardType VARCHAR(255) NULL,
                orderInfo VARCHAR(255) NULL,
                responseCode VARCHAR(255) NULL,
                transactionNo VARCHAR(255) NULL,
                payDate VARCHAR(255) NULL,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_payment_history_order_code (orderCode),
                INDEX idx_payment_history_order_id (order_id),
                INDEX idx_payment_history_transaction_id (transaction_id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE payment_history`);
        await queryRunner.query(`DROP TABLE transactions`);
        await queryRunner.query(`
            ALTER TABLE orders
                DROP COLUMN payment_status,
                DROP COLUMN payment_method
        `);
    }
}
