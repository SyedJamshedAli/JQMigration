import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { SystemLog } from './system-log.entity';
import { Account } from './account.entity';
import { Session } from './session.entity';

export enum UserStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  @Index()
  roleId: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  @Index()
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastSignInAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  emailVerifiedAt: Date;

  @Column({ default: false })
  isTrashed: boolean;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  @Index()
  invitedByUserId: string;

  @Column({ default: false })
  isProtected: boolean;

  @ManyToOne(() => UserRole, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: UserRole;

  @OneToMany(() => SystemLog, (log: SystemLog) => log.user)
  systemLog: SystemLog[];

  @OneToMany(() => Account, (account: Account) => account.user)
  accounts: Account[];

  @OneToMany(() => Session, (session: Session) => session.user)
  sessions: Session[];
}
