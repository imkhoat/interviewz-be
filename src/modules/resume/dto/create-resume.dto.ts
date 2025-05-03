import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({ description: 'The title of the resume' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the resume',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
