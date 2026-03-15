import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('system_logs')
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true })
  entityType: string;

  @Column({ nullable: true })
  event: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  meta: string;

  @ManyToOne(() => User, (user) => user.systemLog)
  @JoinColumn({ name: 'userId' })
  user: User;
}
