import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { PaymentMethodEnum, PaymentStatusEnum } from '../common/enum';
import { Orders } from './orders.entity';
import { Transaction } from './transaction.entity';

@Entity('payment_history')
export class PaymentHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    order_id: number;

    @Column({ nullable: true })
    transaction_id: number;

    @Column()
    orderCode: string;

    @Column({ type: 'enum', enum: PaymentMethodEnum, default: PaymentMethodEnum.CASH })
    paymentMethod: PaymentMethodEnum;

    @Column({ type: 'enum', enum: PaymentStatusEnum, default: PaymentStatusEnum.PENDING })
    paymentStatus: PaymentStatusEnum;

    @Column({ default: 0 })
    amount: number;

    @Column({ nullable: true })
    bankCode: string;

    @Column({ nullable: true })
    bankTranNo: string;

    @Column({ nullable: true })
    cardType: string;

    @Column({ nullable: true })
    orderInfo: string;

    @Column({ nullable: true })
    responseCode: string;

    @Column({ nullable: true })
    transactionNo: string;

    @Column({ nullable: true })
    payDate: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    created_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: dateTimeTransformer,
    })
    updated_at: Date;

    @ManyToOne(() => Orders, (order) => order.paymentHistories)
    @JoinColumn({ name: 'order_id' })
    order: Orders;

    @ManyToOne(() => Transaction, (transaction) => transaction.paymentHistories)
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction;
}
