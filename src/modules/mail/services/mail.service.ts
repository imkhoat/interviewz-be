import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(user: User, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify Your Email',
      template: 'verify-email',
      context: {
        fullName: user.fullName,
        verificationUrl,
      },
    });
  }

  async sendPasswordResetEmail(user: User, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'reset-password',
      context: {
        fullName: user.fullName,
        resetUrl,
      },
    });
  }
} 