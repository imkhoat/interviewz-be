import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '@modules/user/services/user.service';
import { MailService } from '@modules/mail/services/mail.service';
import { User } from '@modules/user/entities/user.entity';
import { LoginResponseDto } from '@modules/auth/dto/login-response.dto';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from '@modules/auth/dto/reset-password.dto';
import { ForgotPasswordDto } from '@modules/auth/dto/forgot-password.dto';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { ChangePasswordDto } from '@modules/auth/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    try {
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        return null;
      }

      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email first');
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async login(user: User): Promise<LoginResponseDto> {
    const tokens = await this.generateTokens(user);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        userRole: user.userRole,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async register(registerDto: any): Promise<{ message: string }> {
    const user = await this.userService.create(registerDto);

    const verificationToken = uuidv4();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24); // Token expires in 24 hours

    await this.userService.update(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: verificationExpires,
    });

    await this.mailService.sendVerificationEmail(user, verificationToken);

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  async verifyEmail(token: string) {
    const user = await this.userService.findByVerificationToken(token);
    
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.emailVerificationTokenExpires < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.userService.update(user.id, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationTokenExpires: undefined,
    });

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationToken = uuidv4();
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);

    await this.userService.update(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: verificationExpires,
    });

    await this.mailService.sendVerificationEmail(user, verificationToken);

    return { message: 'Verification email sent successfully' };
  }

  async refreshToken(userId: number, refreshToken: string): Promise<LoginResponseDto> {
    const user = await this.userService.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user);
    await this.userService.updateRefreshToken(userId, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        userRole: user.userRole,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async logout(userId: number): Promise<{ message: string }> {
    await this.userService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  async signup(createUserDto: any): Promise<LoginResponseDto> {
    const user = await this.userService.create(createUserDto);
    const tokens = await this.generateTokens(user);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        userRole: user.userRole,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async forgotPassword(forgotPasswordDto: any): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    await this.userService.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    await this.mailService.sendResetPasswordEmail(user, resetToken);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetPasswordDto: any): Promise<{ message: string }> {
    const user = await this.userService.findByResetToken(resetPasswordDto.token);
    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    const hashedPassword = await argon2.hash(resetPasswordDto.password);
    await this.userService.updatePassword(user.id, hashedPassword);

    await this.userService.update(user.id, {
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    return { message: 'Password reset successful' };
  }

  async changePassword(userId: number, changePasswordDto: any): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await argon2.verify(user.password, changePasswordDto.currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await argon2.hash(changePasswordDto.newPassword);
    await this.userService.updatePassword(userId, hashedPassword);
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.userRole };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
