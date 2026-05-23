import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Banners {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    url: string;

    @Column()
    image: string;

    @Column({ nullable: true })
    position: number;

    @Column({ nullable: true, default: 0 })
    is_slider: number;

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
