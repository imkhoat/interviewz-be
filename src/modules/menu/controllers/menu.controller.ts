import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../auth/decorators/role.decorator';
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
  findUserMenus(@Req() req: { user: { id: number } }) {
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
