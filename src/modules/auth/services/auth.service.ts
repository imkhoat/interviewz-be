import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { ResetPasswordDto } from '@modules/auth/dto/reset-password.dto';
import { ForgotPasswordDto } from '@modules/auth/dto/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { LoginResponseDto } from '@modules/auth/dto/login-response.dto';
import * as crypto from 'crypto';
import { ChangePasswordDto } from '@modules/auth/dto/change-password.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email first');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.userRepository.update(user.id, {
      refreshToken: tokens.refreshToken,
    });

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

  async signup(payload: CreateUserDto): Promise<{ message: string }> {
    const { email } = payload;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Create new user - password will be hashed by entity hooks
    const user = this.userRepository.create(payload);
    await this.userRepository.save(user);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token expires in 24 hours

    await this.userRepository.update(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: expires,
    });

    // Send verification email
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify Your Email',
      template: 'verify-email',
      context: {
        name: user.fullName || user.email,
        verificationLink: verificationUrl,
      },
    });

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationTokenExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.userRepository.update(user.id, {
      isEmailVerified: true,
      emailVerificationToken: '',
      emailVerificationTokenExpires: new Date(),
    });

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    await this.userRepository.update(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: expires,
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify Your Email',
      template: 'verify-email',
      context: {
        fullName: user.fullName || 'there',
        verificationUrl,
      },
    });

    return { message: 'Verification email has been resent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    console.log('Received token:', token);

    // Find user with valid reset token
    const users = await this.userRepository.find({
      where: {
        resetPasswordExpires: MoreThan(new Date()),
      },
    });
    console.log('Found users with valid expiration:', users.length);

    const user = await Promise.all(
      users.map(async (u) => {
        if (!u.resetPasswordToken) {
          console.log('User has no reset token:', u.id);
          return null;
        }
        try {
          const isValid = await argon2.verify(u.resetPasswordToken, token);
          console.log('Token validation for user', u.id, ':', isValid);
          return isValid ? u : null;
        } catch (error) {
          console.log('Error comparing tokens for user', u.id, ':', error);
          return null;
        }
      }),
    ).then((results) => results.find((u) => u !== null));

    if (!user) {
      console.log('No valid user found with the provided token');
      throw new BadRequestException('Invalid or expired reset token');
    }

    console.log('Found valid user:', user.id);

    try {
      // Update password
      const hashedPassword = await argon2.hash(newPassword);
      await this.userRepository.update(user.id, {
        password: hashedPassword,
        resetPasswordToken: '',
        resetPasswordExpires: new Date(),
      });
    } catch (error) {
      throw new BadRequestException('Error updating password');
    }

    return { message: 'Password has been reset successfully' };
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    try {
      const isPasswordValid = await argon2.verify(
        user.password,
        changePasswordDto.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Set new password directly - it will be hashed by the @BeforeUpdate hook
      user.password = changePasswordDto.newPassword;
      await this.userRepository.save(user);
    } catch (error) {
      throw new UnauthorizedException('Error changing password');
    }
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.userRole };

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
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { password: _pwd, refreshToken: _refresh, ...userInfo } = user;
      return {
        ...userInfo,
        fullName: user.fullName,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { password: _pwd, refreshToken: _refresh, ...userInfo } = user;
    const tokens = await this.generateTokens(user);
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate reset password token
    const resetToken = crypto.randomBytes(32).toString('hex');
    try {
      const hashedToken = await argon2.hash(resetToken);

      // Save token and set expiration (1 hour)
      await this.userRepository.update(user.id, {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
      });
    } catch (error) {
      throw new BadRequestException('Error generating reset token');
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      to: user.email,
      subject: 'Password Reset Request',
      template: 'reset-password',
      context: {
        fullName: user.fullName || 'there',
        resetUrl,
      },
    };

    await this.mailerService.sendMail(mailOptions);

    return { message: 'Password reset email sent' };
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: '' });
    return { message: 'Logged out successfully' };
  }
}
