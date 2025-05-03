import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateResumeDto {
  @ApiProperty({ description: 'The title of the resume', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The description of the resume',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
