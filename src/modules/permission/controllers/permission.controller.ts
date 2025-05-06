import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from '@modules/permission/services/permission.service';
import { CreatePermissionDto } from '@modules/permission/dto/create-permission.dto';
import { UpdatePermissionDto } from '@modules/permission/dto/update-permission.dto';
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

@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles(UserRole.INTERVIEWER)
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @Roles(UserRole.INTERVIEWER)
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'Return all permissions' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.INTERVIEWER)
  @ApiOperation({ summary: 'Get a permission by id' })
  @ApiResponse({ status: 200, description: 'Return the permission' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.INTERVIEWER)
  @ApiOperation({ summary: 'Update a permission' })
  @ApiResponse({ status: 200, description: 'Permission updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @Roles(UserRole.INTERVIEWER)
  @ApiOperation({ summary: 'Delete a permission' })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  delete(@Param('id') id: string) {
    return this.permissionService.delete(+id);
  }
}
