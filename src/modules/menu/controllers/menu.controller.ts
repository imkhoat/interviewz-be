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
  Put,
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
import { Menu } from '@modules/menu/entities/menu.entity';

@Controller('menus')
@UseGuards(JwtAuthGuard, RoleGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles(UserRole.INTERVIEWER)
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiResponse({ status: 201, description: 'Menu created successfully' })
  async create(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @Roles(UserRole.INTERVIEWER)
  @ApiOperation({ summary: 'Get all menus' })
  @ApiResponse({ status: 200, description: 'Return all menus' })
  async findAll(): Promise<Menu[]> {
    return this.menuService.findAll();
  }

  @Get('user')
  findUserMenus(@Req() req: { user: { id: number } }) {
    return this.menuService.findUserMenus(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.INTERVIEWER)
  @ApiOperation({ summary: 'Get a menu by id' })
  @ApiResponse({ status: 200, description: 'Return the menu' })
  async findOne(@Param('id') id: number): Promise<Menu> {
    return this.menuService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.INTERVIEWER)
  @ApiOperation({ summary: 'Update a menu' })
  @ApiResponse({ status: 200, description: 'Menu updated successfully' })
  async update(
    @Param('id') id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @Roles(UserRole.INTERVIEWER)
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
