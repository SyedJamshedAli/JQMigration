import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserPermission } from './user-permission.entity';

@Entity('user_role_permissions')
@Unique(['roleId', 'permissionId'])
export class UserRolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleId: string;

  @Column()
  permissionId: string;

  @CreateDateColumn()
  assignedAt: Date;

  @ManyToOne(() => UserRole, (role) => role.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: UserRole;

  @ManyToOne(() => UserPermission, (perm) => perm.roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permissionId' })
  permission: UserPermission;
}
