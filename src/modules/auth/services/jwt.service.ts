import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async sign(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verify(token: string): Promise<any> {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async decode(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }
} 