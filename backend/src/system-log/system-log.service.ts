import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { SystemLog } from '../entities/system-log.entity';

export interface LogProps {
  event: string;
  userId: string;
  entityId?: string;
  entityType?: string;
  description?: string;
  ipAddress?: string;
  meta?: string;
}

@Injectable()
export class SystemLogService {
  constructor(
    @InjectRepository(SystemLog) private logRepo: Repository<SystemLog>,
  ) {}

  async log(props: LogProps, manager?: EntityManager) {
    try {
      const repo = manager ? manager.getRepository(SystemLog) : this.logRepo;
      const log = repo.create({
        event: props.event,
        userId: props.userId,
        entityId: props.entityId,
        entityType: props.entityType,
        description: props.description,
        ipAddress: props.ipAddress,
        meta: props.meta,
      });
      await repo.save(log);
    } catch (error) {
      console.error('[LOG] Failed to log activity:', error);
    }
  }
}
