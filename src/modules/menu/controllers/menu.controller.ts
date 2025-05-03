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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Menu } from '../entities/menu.entity';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import { UserRole } from '../../user/user.entity';

@ApiTags('menus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: 'Create a new menu' })
  @ApiResponse({
    status: 201,
    description: 'The menu has been successfully created.',
    type: Menu,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @ApiOperation({ summary: 'Get all menus' })
  @ApiResponse({ status: 200, description: 'Return all menus.', type: [Menu] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.menuService.findAll();
  }

  @Get('user')
  findUserMenus(@Request() req: { user: { id: number } }) {
    return this.menuService.findUserMenus(req.user.id);
  }

  @ApiOperation({ summary: 'Update a menu' })
  @ApiResponse({
    status: 200,
    description: 'The menu has been successfully updated.',
    type: Menu,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @ApiOperation({ summary: 'Delete a menu' })
  @ApiResponse({
    status: 200,
    description: 'The menu has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
