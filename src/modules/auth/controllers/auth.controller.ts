import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '@modules/auth/services/auth.service';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';
import { RefreshTokenGuard } from '@modules/auth/guards/refresh.guard';
import { ForgotPasswordDto } from '@modules/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '@modules/auth/dto/reset-password.dto';
import { ChangePasswordDto } from '@modules/auth/dto/change-password.dto';
import { GetUser } from '@modules/auth/decorators/get-user.decorator';
import { LoginResponseDto } from '@modules/auth/dto/login-response.dto';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SignupResponseDto } from '@modules/auth/dto/signup-response.dto';

@ApiTags('auth')
@Controller('auth')
// @UseGuards(JwtAuthGuard, RoleGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<LoginResponseDto> {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Req() req: { user: { id: number; refreshToken: string } },
  ): Promise<LoginResponseDto> {
    return this.authService.refreshToken(req.user.id, req.user.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @Req() req: { user: { id: number } },
  ): Promise<{ message: string }> {
    return this.authService.logout(req.user.id);
  }

  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async signup(@Body() body: CreateUserDto): Promise<SignupResponseDto> {
    return await this.authService.signup(body);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  async changePassword(
    @GetUser('sub') userId: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(userId, changePasswordDto);
    return { message: 'Password changed successfully' };
  }
}
