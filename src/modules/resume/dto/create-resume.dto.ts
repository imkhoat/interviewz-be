import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({ description: 'Title of the resume', example: 'Software Engineer Resume' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the resume', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Template ID used for this resume', required: false })
  @IsNumber()
  @IsOptional()
  templateId?: number;
} 