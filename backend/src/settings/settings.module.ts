import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { StorageModule } from '../storage/storage.module';
import { SystemSetting } from '../entities/system-setting.entity';
import { UserRole } from '../entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSetting, UserRole]), StorageModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
