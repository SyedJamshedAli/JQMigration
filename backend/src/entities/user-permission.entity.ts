import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRolePermission } from './user-role-permission.entity';

@Entity('user_permissions')
export class UserPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  createdByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => UserRolePermission, (rp) => rp.permission)
  roles: UserRolePermission[];
}
