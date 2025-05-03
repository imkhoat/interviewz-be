import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdatePolicyDto {
  @ApiProperty({ description: 'The name of the policy', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The description of the policy',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The resource this policy applies to',
    required: false,
  })
  @IsString()
  @IsOptional()
  resource?: string;

  @ApiProperty({
    description: 'The action this policy allows',
    required: false,
  })
  @IsString()
  @IsOptional()
  action?: string;

  @ApiProperty({
    description: 'The conditions for this policy',
    required: false,
  })
  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;
}
