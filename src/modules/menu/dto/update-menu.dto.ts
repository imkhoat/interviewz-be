import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateMenuDto {
  @ApiProperty({ description: 'The name of the menu', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The icon of the menu', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: 'The path of the menu', required: false })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({ description: 'The order of the menu', required: false })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ description: 'The parent menu id', required: false })
  @IsString()
  @IsOptional()
  parentId?: string;
}
