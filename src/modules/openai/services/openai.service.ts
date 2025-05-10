import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  ChatCompletionDto,
  MessageDto,
} from '@modules/openai/dto/chat-completion.dto';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenAIService.name);

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async createChatCompletion(chatCompletionDto: ChatCompletionDto) {
    try {
      const { messages, model, temperature, max_tokens } = chatCompletionDto;

      const completion = await this.openai.chat.completions.create({
        messages: messages as any,
        model: model as any,
        temperature,
        max_tokens,
      });

      return completion.choices[0].message;
    } catch (error) {
      this.logger.error('Error creating chat completion:', error);
      throw error;
    }
  }

  async createSystemMessage(content: string): Promise<MessageDto> {
    return {
      role: 'system',
      content,
    };
  }

  async createUserMessage(content: string): Promise<MessageDto> {
    return {
      role: 'user',
      content,
    };
  }

  async createAssistantMessage(content: string): Promise<MessageDto> {
    return {
      role: 'assistant',
      content,
    };
  }
}
