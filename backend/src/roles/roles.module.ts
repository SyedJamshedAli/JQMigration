import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UserRole } from '../entities/user-role.entity';
import { UserRolePermission } from '../entities/user-role-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, UserRolePermission])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
