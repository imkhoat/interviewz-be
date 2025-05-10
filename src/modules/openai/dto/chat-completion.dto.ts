import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class MessageDto {
  @ApiProperty({
    description: 'The role of the message sender (system, user, or assistant)',
    enum: ['system', 'user', 'assistant'],
  })
  @IsString()
  role: 'system' | 'user' | 'assistant';

  @ApiProperty({
    description: 'The content of the message',
  })
  @IsString()
  content: string;
}

export class ChatCompletionDto {
  @ApiProperty({
    description: 'The messages to generate a response for',
    type: [MessageDto],
  })
  @IsArray()
  messages: MessageDto[];

  @ApiProperty({
    description: 'The model to use for completion',
    default: 'gpt-3.5-turbo',
  })
  @IsString()
  @IsOptional()
  model?: string = 'gpt-3.5-turbo';

  @ApiProperty({
    description: 'The temperature to use for completion (0-2)',
    default: 0.7,
    minimum: 0,
    maximum: 2,
  })
  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number = 0.7;

  @ApiProperty({
    description: 'The maximum number of tokens to generate',
    default: 1000,
  })
  @IsNumber()
  @IsOptional()
  max_tokens?: number = 1000;
}
