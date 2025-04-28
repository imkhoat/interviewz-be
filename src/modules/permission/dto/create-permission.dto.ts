import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
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