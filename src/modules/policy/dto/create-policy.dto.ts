import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
} from 'class-validator';

export class CreatePolicyDto {
  @ApiProperty({ description: 'The name of the policy' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the policy',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The resource this policy applies to' })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiProperty({ description: 'The action this policy allows' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    description: 'The conditions for this policy',
    required: false,
  })
  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;

  @IsEnum(['allow', 'deny'])
  effect: 'allow' | 'deny';

  @IsArray()
  subjects: string[]; // Array of role names or user IDs

  @IsArray()
  resources: string[]; // Array of resource names

  @IsArray()
  actions: string[]; // Array of action names

  @IsArray()
  @IsOptional()
  roleIds?: number[];
}
