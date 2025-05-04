import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
