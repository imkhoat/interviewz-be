import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    return this.generateTokens(user);
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const userInfo = await this.validateUser(email, password);
    const user = await this.userRepository.findOne({
      where: { id: userInfo.id },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const tokens = await this.generateTokens(user);
    return {
      user: userInfo,
      tokens,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { tempPassword, newPassword } = resetPasswordDto;

    // Find user with valid temporary password
    const users = await this.userRepository.find({
      where: {
        tempPasswordExpires: MoreThan(new Date()),
      },
    });

    const user = await Promise.all(
      users.map(async (u) => {
        const isValid = await bcrypt.compare(
          tempPassword,
          u.tempPassword || '',
        );
        return isValid ? u : null;
      }),
    ).then((results) => results.find((u) => u !== null));

    if (!user) {
      throw new BadRequestException('Invalid or expired temporary password');
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.tempPassword = '';
    user.tempPasswordExpires = new Date();
    await this.userRepository.save(user);

    return { message: 'Password has been reset successfully' };
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    // Update password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    await this.userRepository.update(user.id, { refreshToken });
    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, refreshToken: __, ...userInfo } = user;
      return userInfo;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const { password: _, refreshToken: __, ...userInfo } = user;
    const tokens = await this.generateTokens(user);
    return {
      user: userInfo,
      tokens,
    };
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: '' });
  }

  async signup(payload: CreateUserDto) {
    const user = this.userRepository.create(payload);
    await this.userRepository.save(user);
    return this.generateTokens(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    // Save temporary password and set expiration (1 hour)
    await this.userRepository.update(user.id, {
      tempPassword: hashedTempPassword,
      tempPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
    });

    const mailOptions = {
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.fullName},</p>
          <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
          <p>Here is your temporary password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 18px;">
              ${tempPassword}
            </div>
          </div>
          <p>This temporary password will expire in 1 hour.</p>
          <p>Please use this temporary password to reset your password. After logging in, you should change your password immediately.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br>InterviewZ Team</p>
        </div>
      `,
    };

    await this.mailerService.sendMail(mailOptions);

    return { message: 'Password reset email sent' };
  }
}
