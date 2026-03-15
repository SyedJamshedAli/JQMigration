import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('system_settings')
export class SystemSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'My Company' })
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  websiteURL: string;

  @Column({ nullable: true })
  supportEmail: string;

  @Column({ nullable: true })
  supportPhone: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ default: '$ {value}' })
  currencyFormat: string;

  @Column({ nullable: true })
  socialFacebook: string;

  @Column({ nullable: true })
  socialTwitter: string;

  @Column({ nullable: true })
  socialInstagram: string;

  @Column({ nullable: true })
  socialLinkedIn: string;

  @Column({ nullable: true })
  socialPinterest: string;

  @Column({ nullable: true })
  socialYoutube: string;

  @Column({ default: true })
  notifyStockEmail: boolean;

  @Column({ default: true })
  notifyStockWeb: boolean;

  @Column({ default: 10 })
  notifyStockThreshold: number;

  @Column('simple-array', { default: '' })
  notifyStockRoleIds: string[];

  @Column({ default: true })
  notifyNewOrderEmail: boolean;

  @Column({ default: true })
  notifyNewOrderWeb: boolean;

  @Column('simple-array', { default: '' })
  notifyNewOrderRoleIds: string[];

  @Column({ default: true })
  notifyOrderStatusUpdateEmail: boolean;

  @Column({ default: true })
  notifyOrderStatusUpdateWeb: boolean;

  @Column('simple-array', { default: '' })
  notifyOrderStatusUpdateRoleIds: string[];

  @Column({ default: true })
  notifyPaymentFailureEmail: boolean;

  @Column({ default: true })
  notifyPaymentFailureWeb: boolean;

  @Column('simple-array', { default: '' })
  notifyPaymentFailureRoleIds: string[];

  @Column({ default: true })
  notifySystemErrorFailureEmail: boolean;

  @Column({ default: true })
  notifySystemErrorWeb: boolean;

  @Column('simple-array', { default: '' })
  notifySystemErrorRoleIds: string[];
}
