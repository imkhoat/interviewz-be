import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({ description: 'The name of the resource' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the resource',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The type of the resource' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'The path of the resource' })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({ description: 'The method of the resource' })
  @IsString()
  @IsNotEmpty()
  method: string;
}
