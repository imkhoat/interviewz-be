import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
} 