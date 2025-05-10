import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({ description: 'JWT access token for authentication' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token for getting new access tokens' })
  refreshToken: string;
}
