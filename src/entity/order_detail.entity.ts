import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Orders } from './orders.entity';
import { Products } from './products.entity';

@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product_id: string;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @ManyToOne(() => Orders, (orders) => orders.orderDetail)
    @JoinColumn({ name: 'order_id' })
    orders: Orders;

    @OneToOne(() => Products, (products) => products.orderDetail)
    @JoinColumn({ name: 'product_id' })
    products: Products;
}
