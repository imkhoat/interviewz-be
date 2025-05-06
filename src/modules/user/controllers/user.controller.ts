import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '@modules/user/services/user.service';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';
import { RoleGuard } from '@modules/auth/guards/role.guard';
import { Roles } from '@modules/auth/decorators/role.decorator';
import { UserRole } from '@modules/user/enums/user-role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '@modules/user/entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', description: 'User email address' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findById(id);
  }

  @Get()
  @Roles(UserRole.INTERVIEWER)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
