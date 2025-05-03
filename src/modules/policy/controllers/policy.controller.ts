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
import { PolicyService } from '../services/policy.service';
import { CreatePolicyDto } from '../dto/create-policy.dto';
import { UpdatePolicyDto } from '../dto/update-policy.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Policy } from '../entities/policy.entity';

@ApiTags('policies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @ApiOperation({ summary: 'Create a new policy' })
  @ApiResponse({
    status: 201,
    description: 'The policy has been successfully created.',
    type: Policy,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  create(@Body() createPolicyDto: CreatePolicyDto) {
    return this.policyService.create(createPolicyDto);
  }

  @ApiOperation({ summary: 'Get all policies' })
  @ApiResponse({
    status: 200,
    description: 'Return all policies.',
    type: [Policy],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  findAll() {
    return this.policyService.findAll();
  }

  @ApiOperation({ summary: 'Get a policy by id' })
  @ApiResponse({ status: 200, description: 'Return the policy.', type: Policy })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Policy not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policyService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a policy' })
  @ApiResponse({
    status: 200,
    description: 'The policy has been successfully updated.',
    type: Policy,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Policy not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePolicyDto: UpdatePolicyDto) {
    return this.policyService.update(id, updatePolicyDto);
  }

  @ApiOperation({ summary: 'Delete a policy' })
  @ApiResponse({
    status: 200,
    description: 'The policy has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Policy not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.policyService.remove(id);
  }
}
