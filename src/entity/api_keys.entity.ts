import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('api_keys')
export class ApiKeys {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'varchar', length: 512 })
    api_key: string;

    @Column({ default: 'gemini-3.6-flash' })
    model: string;

    @Column({ type: 'date' })
    expires_at: Date;

    @Column({ default: 0 })
    token_quota: number;

    @Column({ default: 0 })
    token_used: number;

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
    updated_at: Date;

    @Column({ type: 'timestamp', nullable: true, transformer: dateTimeTransformer })
    deleted_at: Date;

    @Column({ nullable: true })
    created_by: number;

    @Column({ nullable: true })
    updated_by: number;

    @Column({ nullable: true })
    deleted_by: number;
}
