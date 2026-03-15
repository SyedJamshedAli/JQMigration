import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get system settings' })
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Post('general')
  @ApiOperation({ summary: 'Update general settings' })
  updateGeneral(@Body() data: any) {
    return this.settingsService.updateGeneral(data);
  }

  @Post('notifications')
  @ApiOperation({ summary: 'Update notification settings' })
  updateNotifications(@Body() data: any) {
    return this.settingsService.updateNotifications(data);
  }

  @Post('social')
  @ApiOperation({ summary: 'Update social links' })
  updateSocial(@Body() data: any) {
    return this.settingsService.updateSocial(data);
  }
}
