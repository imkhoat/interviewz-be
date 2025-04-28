import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsString()
  path: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;

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
