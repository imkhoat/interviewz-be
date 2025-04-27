import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreatePolicyDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['allow', 'deny'])
  effect: 'allow' | 'deny';

  @IsArray()
  subjects: string[]; // Array of role names or user IDs

  @IsArray()
  resources: string[]; // Array of resource names

  @IsArray()
  actions: string[]; // Array of action names

  @IsOptional()
  conditions?: Record<string, any>;

  @IsArray()
  @IsOptional()
  roleIds?: number[];
} 