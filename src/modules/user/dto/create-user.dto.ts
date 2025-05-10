import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'User first name', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'User last name', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'User avatar URL', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ description: 'Google OAuth ID', required: false })
  @IsString()
  @IsOptional()
  googleId?: string;

  @ApiProperty({ description: 'LinkedIn OAuth ID', required: false })
  @IsString()
  @IsOptional()
  linkedinId?: string;

  @ApiProperty({ description: 'Facebook OAuth ID', required: false })
  @IsString()
  @IsOptional()
  facebookId?: string;
}
