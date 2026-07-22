import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderDetail } from './order_detail.entity';
import { PaymentMethodEnum, PaymentStatusEnum } from '../common/enum';
import { Transaction } from './transaction.entity';
import { PaymentHistory } from './payment_history.entity';

@Entity()
export class Orders {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    code: string;

    @Column()
    phone: string;

    @Column({ type: 'text' })
    address: string;

    @Column({ default: 2 })
    status: number;

    @Column({ type: 'enum', enum: PaymentMethodEnum, default: PaymentMethodEnum.CASH })
    payment_method: PaymentMethodEnum;

    @Column({ type: 'enum', enum: PaymentStatusEnum, default: PaymentStatusEnum.PENDING })
    payment_status: PaymentStatusEnum;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    created_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: dateTimeTransformer,
    })
    updated_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: dateTimeTransformer,
    })
    deleted_at: Date;

    @Column({ nullable: true })
    updated_by: number;

    @Column({ nullable: true })
    deleted_by: number;

    @OneToMany(() => OrderDetail, (ordersDetail) => ordersDetail.orders)
    orderDetail: OrderDetail[];

    @OneToMany(() => Transaction, (transaction) => transaction.order)
    transactions: Transaction[];

    @OneToMany(() => PaymentHistory, (paymentHistory) => paymentHistory.order)
    paymentHistories: PaymentHistory[];
}
