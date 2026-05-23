import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Products } from './products.entity';

@Entity()
export class ProductsImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    product_id: number;

    @Column({ default: 2 })
    is_thumbnail: number;

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

    @ManyToOne(() => Products, (product) => product.productImage)
    @JoinColumn({ name: 'product_id' })
    product: Products;
}
