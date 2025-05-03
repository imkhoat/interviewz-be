import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ description: 'The name of the menu' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The icon of the menu', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: 'The path of the menu', required: false })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({ description: 'The order of the menu' })
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty({ description: 'The parent menu id', required: false })
  @IsString()
  @IsOptional()
  parentId?: string;

  @IsArray()
  @IsOptional()
  permissionIds?: number[];

  @IsArray()
  @IsOptional()
  roleIds?: number[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  component?: string;
}
