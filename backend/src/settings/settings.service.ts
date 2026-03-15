import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { SystemSetting } from '../entities/system-setting.entity';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SystemSetting) private settingRepo: Repository<SystemSetting>,
    @InjectRepository(UserRole) private roleRepo: Repository<UserRole>,
    private storage: StorageService,
  ) {}

  async getSettings() {
    const settings = await this.settingRepo.findOne({ where: {} });
    const roles = await this.roleRepo.find({
      where: { isTrashed: false },
      select: ['id', 'name'],
    });
    return { settings, roles };
  }

  async updateGeneral(data: any) {
    const settings = await this.settingRepo.findOne({ where: {} });
    if (!settings) throw new NotFoundException('Settings not found.');

    await this.settingRepo.update(settings.id, {
      name: data.name,
      address: data.address,
      websiteURL: data.websiteURL,
      supportEmail: data.supportEmail,
      supportPhone: data.supportPhone,
      language: data.language,
      timezone: data.timezone,
      currency: data.currency,
      currencyFormat: data.currencyFormat,
    });

    return this.settingRepo.findOne({ where: { id: settings.id } });
  }

  async updateNotifications(data: any) {
    const settings = await this.settingRepo.findOne({ where: {} });
    if (!settings) throw new NotFoundException('Settings not found.');

    await this.settingRepo.update(settings.id, {
      notifyStockEmail: data.notifyStockEmail,
      notifyStockWeb: data.notifyStockWeb,
      notifyStockThreshold: data.notifyStockThreshold,
      notifyStockRoleIds: data.notifyStockRoleIds,
      notifyNewOrderEmail: data.notifyNewOrderEmail,
      notifyNewOrderWeb: data.notifyNewOrderWeb,
      notifyNewOrderRoleIds: data.notifyNewOrderRoleIds,
      notifyOrderStatusUpdateEmail: data.notifyOrderStatusUpdateEmail,
      notifyOrderStatusUpdateWeb: data.notifyOrderStatusUpdateWeb,
      notifyOrderStatusUpdateRoleIds: data.notifyOrderStatusUpdateRoleIds,
      notifyPaymentFailureEmail: data.notifyPaymentFailureEmail,
      notifyPaymentFailureWeb: data.notifyPaymentFailureWeb,
      notifyPaymentFailureRoleIds: data.notifyPaymentFailureRoleIds,
      notifySystemErrorFailureEmail: data.notifySystemErrorFailureEmail,
      notifySystemErrorWeb: data.notifySystemErrorWeb,
      notifySystemErrorRoleIds: data.notifySystemErrorRoleIds,
    });

    return this.settingRepo.findOne({ where: { id: settings.id } });
  }

  async updateSocial(data: any) {
    const settings = await this.settingRepo.findOne({ where: {} });
    if (!settings) throw new NotFoundException('Settings not found.');

    await this.settingRepo.update(settings.id, {
      socialFacebook: data.socialFacebook,
      socialTwitter: data.socialTwitter,
      socialInstagram: data.socialInstagram,
      socialLinkedIn: data.socialLinkedIn,
      socialPinterest: data.socialPinterest,
      socialYoutube: data.socialYoutube,
    });

    return this.settingRepo.findOne({ where: { id: settings.id } });
  }
}
