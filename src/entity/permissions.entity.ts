import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { RoleHasPermissions } from './role_has_permission.entity';

@Entity()
export class Permissions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    slug: string;

    @Column()
    parent_id: number;

    @Column()
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

    @Column({ nullable: true })
    created_by: number;

    @Column({ nullable: true })
    updated_by: number;

    @ManyToOne(() => Permissions, (permission) => permission.children)
    @JoinColumn({ name: 'parent_id' })
    parent: Permissions;

    @OneToMany(() => Permissions, (permission) => permission.parent)
    children: Permissions[];

    @OneToMany(() => RoleHasPermissions, (roleHasPermission) => roleHasPermission.permission)
    roleHasPermissions: RoleHasPermissions[];
}
