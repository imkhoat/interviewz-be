import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OpenAIService } from '@modules/openai/services/openai.service';
import { ChatCompletionDto } from '@modules/openai/dto/chat-completion.dto';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('openai')
@Controller('openai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Create a chat completion' })
  @ApiResponse({
    status: 200,
    description: 'Chat completion created successfully',
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: ['assistant'],
        },
        content: {
          type: 'string',
        },
      },
    },
  })
  async createChatCompletion(@Body() chatCompletionDto: ChatCompletionDto) {
    return this.openAIService.createChatCompletion(chatCompletionDto);
  }
}
