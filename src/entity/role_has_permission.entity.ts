import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Permissions } from './permissions.entity';
import { Roles } from './roles.entity';

@Entity()
export class RoleHasPermissions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role_id: number;

    @Column()
    permission_id: number;

    @ManyToOne(() => Roles, (role) => role.roleHasPermissions)
    @JoinColumn({ name: 'role_id' })
    role: Roles;

    @ManyToOne(() => Permissions, (permission) => permission.roleHasPermissions)
    @JoinColumn({ name: 'permission_id' })
    permission: Permissions;
}
