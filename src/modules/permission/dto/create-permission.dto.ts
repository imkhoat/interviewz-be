import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'The name of the permission', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The description of the permission',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsString()
  @IsOptional()
  resource?: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsOptional()
  conditions?: Record<string, any>;

  @IsArray()
  @IsOptional()
  roleIds?: number[];

  @IsArray()
  @IsOptional()
  menuIds?: number[];
}
