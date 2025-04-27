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
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import * as crypto from 'crypto';
import { ChangePasswordDto } from './dto/change-password.dto';

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
        const isValid = await bcrypt.compare(token, u.resetPasswordToken);
        console.log('Token validation for user', u.id, ':', isValid);
        return isValid ? u : null;
      }),
    ).then((results) => results.find((u) => u !== null));

    if (!user) {
      console.log('No valid user found with the provided token');
      throw new BadRequestException('Invalid or expired reset token');
    }

    console.log('Found valid user:', user.id);

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: '',
      resetPasswordExpires: new Date(),
    });

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

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);
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
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, refreshToken: __, ...userInfo } = user;
      return {
        ...userInfo,
        fullName: user.fullName,
      };
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
      user: {
        ...userInfo,
        fullName: user.fullName,
      },
      tokens,
    };
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

    // Generate reset password token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Save token and set expiration (1 hour)
    await this.userRepository.update(user.id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
    });

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
