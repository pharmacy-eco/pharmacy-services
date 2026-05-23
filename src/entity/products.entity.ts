import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { ProductsImage } from './products_image.entity';
import { Categories } from './categories.entity';
import { OrderDetail } from './order_detail.entity';

@Entity()
export class Products {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    unit: string;

    @Column()
    price: number;

    @Column()
    current_price: number;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    content: string;

    @Column()
    meta_name: string;

    @Column({ nullable: true, default: 0 })
    is_hot: number;

    @Column({ nullable: true })
    meta_description: string;

    @Column({ type: 'json' })
    optionals: Record<string, string | number | boolean>;

    @Column({ default: 2 })
    status: number;

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

    @Column()
    created_by: number;

    @Column()
    updated_by: number;

    @Column()
    deleted_by: number;

    @OneToMany(() => ProductsImage, (productImage) => productImage.product)
    productImage: ProductsImage[];

    @ManyToMany(() => Categories, (category) => category.product, { cascade: true })
    @JoinTable({
        name: 'products_has_categories',
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'id',
        },
    })
    category: Categories[];

    @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.products)
    orderDetail: OrderDetail;
}
