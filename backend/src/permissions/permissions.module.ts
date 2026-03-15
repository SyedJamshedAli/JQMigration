import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { UserPermission } from '../entities/user-permission.entity';
import { UserRolePermission } from '../entities/user-role-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermission, UserRolePermission])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
