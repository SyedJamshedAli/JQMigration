import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { UserRolePermission } from './user-role-permission.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isTrashed: boolean;

  @Column({ nullable: true })
  createdByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isProtected: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => UserRolePermission, (rp) => rp.role)
  permissions: UserRolePermission[];
}
