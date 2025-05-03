import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @ApiProperty({ description: 'The name of the resource', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The description of the resource',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The type of the resource', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'The path of the resource', required: false })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({ description: 'The method of the resource', required: false })
  @IsString()
  @IsOptional()
  method?: string;
}
