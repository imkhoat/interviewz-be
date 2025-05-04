import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../user/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findById(id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getUsers() {
    return this.userService.findAll();
  }
}
