import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  async getUser(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get()
  async getUsers() {
    return this.userService.findAll();
  }
}
