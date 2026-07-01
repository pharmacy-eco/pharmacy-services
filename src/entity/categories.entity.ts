import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Products } from './products.entity';
import { Blogs } from './blogs.entity';

@Entity()
export class Categories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    parent_id: number;

    @Column()
    is_hot: number;

    @Column()
    image: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    meta_name: string;

    @Column({ nullable: true })
    meta_description: string;

    @Column({ default: 2 })
    status: number;

    @Column({ default: 'PRODUCT' })
    type: string;

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

    @ManyToMany(() => Products, (product) => product.category)
    product: Products[];

    @ManyToOne(() => Categories, (category) => category.children, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent: Categories;

    @OneToMany(() => Categories, (category) => category.parent)
    children: Categories[];

    @OneToMany(() => Blogs, (blog) => blog.category)
    blogs: Blogs[];
}
