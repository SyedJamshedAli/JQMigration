import { Injectable, UnauthorizedException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { User, UserStatus } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { VerificationToken } from '../entities/verification-token.entity';
import { SignupDto } from './dto/signup.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserRole) private roleRepo: Repository<UserRole>,
    @InjectRepository(VerificationToken) private tokenRepo: Repository<VerificationToken>,
    private dataSource: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found. Please register first.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials. Incorrect password.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Account not activated. Please verify your email.');
    }

    await this.userRepo.update(user.id, { lastSignInAt: new Date() });

    return user;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      roleName: user.role?.name,
      avatar: user.avatar,
      status: user.status,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d') as any,
      }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        status: user.status,
        roleId: user.roleId,
        roleName: user.role?.name,
      },
    };
  }

  async signup(dto: SignupDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      if (existingUser.status === UserStatus.INACTIVE) {
        await this.sendVerificationEmail(existingUser.id, existingUser.email);
        return { message: 'Verification email resent. Please check your inbox.' };
      }
      throw new ConflictException('User with this email already exists.');
    }

    const defaultRole = await this.roleRepo.findOne({
      where: { isDefault: true },
    });

    if (!defaultRole) {
      throw new BadRequestException('Default role not configured.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      roleId: defaultRole.id,
      status: UserStatus.INACTIVE,
    });

    const savedUser = await this.userRepo.save(user);
    await this.sendVerificationEmail(savedUser.id, savedUser.email);

    return { message: 'Account created. Please check your email to verify.' };
  }

  private async sendVerificationEmail(userId: string, email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const verificationToken = this.tokenRepo.create({ identifier: email, token, expires });
    await this.tokenRepo.save(verificationToken);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    await this.mailService.sendEmail({
      to: email,
      subject: 'Verify your email',
      content: {
        title: 'Email Verification',
        description: 'Click the button below to verify your email address.',
        buttonLabel: 'Verify Email',
        buttonUrl: verifyUrl,
      },
    });
  }

  async verifyEmail(token: string) {
    const verificationToken = await this.tokenRepo.findOne({ where: { token } });

    if (!verificationToken || verificationToken.expires < new Date()) {
      throw new BadRequestException('Invalid or expired verification token.');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.update(User, { email: verificationToken.identifier }, {
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      });
      await manager.delete(VerificationToken, { token });
    });

    return { message: 'Email verified successfully.' };
  }

  async resetPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      const verificationToken = this.tokenRepo.create({ identifier: email, token, expires });
      await this.tokenRepo.save(verificationToken);

      const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
      const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

      await this.mailService.sendEmail({
        to: email,
        subject: 'Reset your password',
        content: {
          title: 'Password Reset',
          description: 'Click the button below to reset your password.',
          buttonLabel: 'Reset Password',
          buttonUrl: resetUrl,
        },
      });
    }

    return { message: 'If an account exists, a reset email has been sent.' };
  }

  async verifyResetToken(token: string) {
    const verificationToken = await this.tokenRepo.findOne({ where: { token } });

    if (!verificationToken || verificationToken.expires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    return { valid: true };
  }

  async changePassword(dto: ChangePasswordDto) {
    const verificationToken = await this.tokenRepo.findOne({ where: { token: dto.token } });

    if (!verificationToken || verificationToken.expires < new Date()) {
      throw new BadRequestException('Invalid or expired token.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.dataSource.transaction(async (manager) => {
      await manager.update(User, { email: verificationToken.identifier }, { password: hashedPassword });
      await manager.delete(VerificationToken, { token: dto.token });
    });

    await this.mailService.sendEmail({
      to: verificationToken.identifier,
      subject: 'Password changed successfully',
      content: {
        title: 'Password Changed',
        description: 'Your password has been changed successfully.',
      },
    });

    return { message: 'Password changed successfully.' };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
        relations: ['role'],
      });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Invalid user.');
      }

      return this.login(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }
}
