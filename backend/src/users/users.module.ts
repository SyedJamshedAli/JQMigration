import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StorageModule } from '../storage/storage.module';
import { SystemLogModule } from '../system-log/system-log.module';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole]), StorageModule, SystemLogModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
