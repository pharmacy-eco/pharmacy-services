import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProductsHasCategories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product_id: number;

    @Column()
    category_id: number;
}
