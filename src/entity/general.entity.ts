import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class General {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    company: string;

    @Column()
    link_map: string;

    @Column()
    iframe_map: string;

    @Column()
    info: string;

    @Column()
    hotline: string;

    @Column()
    address: string;

    @Column()
    email: string;

    @Column()
    logo: string;

    @Column()
    favicon: string;

    @Column({ type: 'json' })
    social: Record<string, string>;

    @Column()
    add_body: string;

    @Column()
    add_header: string;

    @Column()
    meta_title: string;

    @Column()
    meta_keyword: string;

    @Column()
    meta_description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    created_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: dateTimeTransformer,
    })
    updated_at: Date;
}
