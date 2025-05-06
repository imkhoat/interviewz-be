import { IsString, IsEmail, IsOptional, MinLength, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emailVerificationToken?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  emailVerificationTokenExpires?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resetPasswordToken?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  resetPasswordExpires?: Date;
} 