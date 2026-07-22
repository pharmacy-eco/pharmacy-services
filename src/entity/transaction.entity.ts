import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { PaymentMethodEnum, PaymentStatusEnum } from '../common/enum';
import { Orders } from './orders.entity';
import { PaymentHistory } from './payment_history.entity';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    order_id: number;

    @Column()
    orderCode: string;

    @Column({ type: 'enum', enum: PaymentMethodEnum, default: PaymentMethodEnum.CASH })
    paymentMethod: PaymentMethodEnum;

    @Column({ default: 0 })
    amount: number;

    @Column({ nullable: true })
    payDate: string;

    @Column({ nullable: true, unique: true })
    transactionNo: string;

    @Column({ type: 'enum', enum: PaymentStatusEnum, default: PaymentStatusEnum.PENDING })
    transactionStatus: PaymentStatusEnum;

    @Column({ nullable: true })
    responseCode: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    created_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: dateTimeTransformer,
    })
    updated_at: Date;

    @ManyToOne(() => Orders, (order) => order.transactions)
    @JoinColumn({ name: 'order_id' })
    order: Orders;

    @OneToMany(() => PaymentHistory, (paymentHistory) => paymentHistory.transaction)
    paymentHistories: PaymentHistory[];
}
