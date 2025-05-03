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
import { ResourceService } from '../services/resource.service';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { UpdateResourceDto } from '../dto/update-resource.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Resource } from '../entities/resource.entity';

@ApiTags('resources')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @ApiOperation({ summary: 'Create a new resource' })
  @ApiResponse({
    status: 201,
    description: 'The resource has been successfully created.',
    type: Resource,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourceService.create(createResourceDto);
  }

  @ApiOperation({ summary: 'Get all resources' })
  @ApiResponse({
    status: 200,
    description: 'Return all resources.',
    type: [Resource],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  findAll() {
    return this.resourceService.findAll();
  }

  @ApiOperation({ summary: 'Get a resource by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the resource.',
    type: Resource,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a resource' })
  @ApiResponse({
    status: 200,
    description: 'The resource has been successfully updated.',
    type: Resource,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourceService.update(id, updateResourceDto);
  }

  @ApiOperation({ summary: 'Delete a resource' })
  @ApiResponse({
    status: 200,
    description: 'The resource has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceService.remove(id);
  }
}
