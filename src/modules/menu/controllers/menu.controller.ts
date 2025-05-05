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
import { MenuService } from '@modules/menu/services/menu.service';
import { CreateMenuDto } from '@modules/menu/dto/create-menu.dto';
import { UpdateMenuDto } from '@modules/menu/dto/update-menu.dto';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';
import { RoleGuard } from '@modules/auth/guards/role.guard';
import { Roles } from '@modules/auth/decorators/role.decorator';
import { UserRole } from '@modules/user/enums/user-role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

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
