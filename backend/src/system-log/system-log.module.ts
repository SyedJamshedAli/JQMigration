import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogService } from './system-log.service';
import { SystemLog } from '../entities/system-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SystemLog])],
  providers: [SystemLogService],
  exports: [SystemLogService],
})
export class SystemLogModule {}
