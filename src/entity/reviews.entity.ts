import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Reviews {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    content: string;

    @Column()
    product_id: number;

    @Column()
    star: number;

    @Column({ default: 1 })
    status: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    created_at: Date;

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
    deleted_by: number;
}
