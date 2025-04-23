import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { RefreshTokenGuard } from './refresh.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
// @UseGuards(JwtAuthGuard, RoleGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log('login', body);
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.generateTokens(user);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req) {
    return this.authService.refreshToken(req.user.id, req.user.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    console.log(body);
    return this.authService.signup(body);
  }
}
