import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  tempPassword: string;

  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}
