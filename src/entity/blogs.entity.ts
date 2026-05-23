import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Blogs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column()
    image: string;

    @Column()
    category_id: number;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    content: string;

    @Column()
    meta_title: string;

    @Column({ nullable: true })
    meta_description: string;

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
}
