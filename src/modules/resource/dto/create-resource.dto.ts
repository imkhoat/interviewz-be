import { IsString, IsOptional } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  attributes?: Record<string, any>;

  @IsString()
  @IsOptional()
  description?: string;
} 