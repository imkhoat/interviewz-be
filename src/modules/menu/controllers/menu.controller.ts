import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { RoleGuard } from '../../auth/role.guard';
import { Roles } from '../../auth/role.decorator';
import { UserRole } from '../../user/user.entity';

@Controller('menus')
@UseGuards(JwtAuthGuard, RoleGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.menuService.findAll();
  }

  @Get('user')
  findUserMenus(@Request() req: { user: { id: number } }) {
    return this.menuService.findUserMenus(req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
