import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ResumeService } from '../services/resume.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../user/enums/role.enum';
import { RequestWithUser } from '../../auth/interfaces/request.interface';
import { Resume } from '../entities/resume.entity';
import { ResumeDetail } from '../entities/resume-detail.entity';
import { ResumeSection } from '../entities/resume-section.entity';
import { WorkExperience } from '../entities/work-experience.entity';
import { Education } from '../entities/education.entity';
import { Skill } from '../entities/skill.entity';
import { Project } from '../entities/project.entity';
import { Certification } from '../entities/certification.entity';
import { CustomSection } from '../entities/custom-section.entity';
import { CustomItem } from '../entities/custom-item.entity';
import { ResumeVersion } from '../entities/resume-version.entity';
import { CreateResumeDto } from '../dto/create-resume.dto';
import { UpdateResumeDto } from '../dto/update-resume.dto';

@ApiTags('resumes')
@ApiBearerAuth()
@Controller('resumes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @ApiOperation({ summary: 'Create a new resume' })
  @ApiResponse({
    status: 201,
    description: 'The resume has been successfully created.',
    type: Resume,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  create(@Body() createResumeDto: CreateResumeDto, @Req() req) {
    return this.resumeService.create(createResumeDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all resumes for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Return all resumes.',
    type: [Resume],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  findAll(@Req() req) {
    return this.resumeService.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Get a resume by id' })
  @ApiResponse({ status: 200, description: 'Return the resume.', type: Resume })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Resume not found.' })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.resumeService.findOne(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update a resume' })
  @ApiResponse({
    status: 200,
    description: 'The resume has been successfully updated.',
    type: Resume,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Resume not found.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @Req() req,
  ) {
    return this.resumeService.update(id, updateResumeDto, req.user.id);
  }

  @ApiOperation({ summary: 'Delete a resume' })
  @ApiResponse({
    status: 200,
    description: 'The resume has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Resume not found.' })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.resumeService.remove(id, req.user.id);
  }

  @Post(':id/detail')
  @ApiOperation({ summary: 'Create resume detail' })
  @ApiResponse({
    status: 201,
    description: 'The resume detail has been successfully created.',
    type: ResumeDetail,
  })
  async createResumeDetail(
    @Param('id') resumeId: string,
    @Body() data: Partial<ResumeDetail>,
  ): Promise<ResumeDetail> {
    return this.resumeService.createResumeDetail(resumeId, data);
  }

  @Put('detail/:id')
  @ApiOperation({ summary: 'Update resume detail' })
  @ApiResponse({
    status: 200,
    description: 'The resume detail has been successfully updated.',
    type: ResumeDetail,
  })
  async updateResumeDetail(
    @Param('id') id: string,
    @Body() data: Partial<ResumeDetail>,
  ): Promise<ResumeDetail> {
    return this.resumeService.updateResumeDetail(id, data);
  }

  @Post(':id/sections')
  @ApiOperation({ summary: 'Create a resume section' })
  @ApiResponse({
    status: 201,
    description: 'The resume section has been successfully created.',
    type: ResumeSection,
  })
  async createResumeSection(
    @Param('id') resumeId: string,
    @Body() data: Partial<ResumeSection>,
  ): Promise<ResumeSection> {
    return this.resumeService.createResumeSection(resumeId, data);
  }

  @Put('sections/:id')
  @ApiOperation({ summary: 'Update a resume section' })
  @ApiResponse({
    status: 200,
    description: 'The resume section has been successfully updated.',
    type: ResumeSection,
  })
  async updateResumeSection(
    @Param('id') id: string,
    @Body() data: Partial<ResumeSection>,
  ): Promise<ResumeSection> {
    return this.resumeService.updateResumeSection(id, data);
  }

  @Delete('sections/:id')
  @ApiOperation({ summary: 'Delete a resume section' })
  @ApiResponse({
    status: 200,
    description: 'The resume section has been successfully deleted.',
  })
  async deleteResumeSection(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteResumeSection(id);
  }

  @Post(':id/experiences')
  @ApiOperation({ summary: 'Create a work experience' })
  @ApiResponse({
    status: 201,
    description: 'The work experience has been successfully created.',
    type: WorkExperience,
  })
  async createWorkExperience(
    @Param('id') resumeId: string,
    @Body() data: Partial<WorkExperience>,
  ): Promise<WorkExperience> {
    return this.resumeService.createWorkExperience(resumeId, data);
  }

  @Put('experiences/:id')
  @ApiOperation({ summary: 'Update a work experience' })
  @ApiResponse({
    status: 200,
    description: 'The work experience has been successfully updated.',
    type: WorkExperience,
  })
  async updateWorkExperience(
    @Param('id') id: string,
    @Body() data: Partial<WorkExperience>,
  ): Promise<WorkExperience> {
    return this.resumeService.updateWorkExperience(id, data);
  }

  @Delete('experiences/:id')
  @ApiOperation({ summary: 'Delete a work experience' })
  @ApiResponse({
    status: 200,
    description: 'The work experience has been successfully deleted.',
  })
  async deleteWorkExperience(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteWorkExperience(id);
  }

  @Post(':id/educations')
  @ApiOperation({ summary: 'Create an education' })
  @ApiResponse({
    status: 201,
    description: 'The education has been successfully created.',
    type: Education,
  })
  async createEducation(
    @Param('id') resumeId: string,
    @Body() data: Partial<Education>,
  ): Promise<Education> {
    return this.resumeService.createEducation(resumeId, data);
  }

  @Put('educations/:id')
  @ApiOperation({ summary: 'Update an education' })
  @ApiResponse({
    status: 200,
    description: 'The education has been successfully updated.',
    type: Education,
  })
  async updateEducation(
    @Param('id') id: string,
    @Body() data: Partial<Education>,
  ): Promise<Education> {
    return this.resumeService.updateEducation(id, data);
  }

  @Delete('educations/:id')
  @ApiOperation({ summary: 'Delete an education' })
  @ApiResponse({
    status: 200,
    description: 'The education has been successfully deleted.',
  })
  async deleteEducation(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteEducation(id);
  }

  @Post(':id/skills')
  @ApiOperation({ summary: 'Create a skill' })
  @ApiResponse({
    status: 201,
    description: 'The skill has been successfully created.',
    type: Skill,
  })
  async createSkill(
    @Param('id') resumeId: string,
    @Body() data: Partial<Skill>,
  ): Promise<Skill> {
    return this.resumeService.createSkill(resumeId, data);
  }

  @Put('skills/:id')
  @ApiOperation({ summary: 'Update a skill' })
  @ApiResponse({
    status: 200,
    description: 'The skill has been successfully updated.',
    type: Skill,
  })
  async updateSkill(
    @Param('id') id: string,
    @Body() data: Partial<Skill>,
  ): Promise<Skill> {
    return this.resumeService.updateSkill(id, data);
  }

  @Delete('skills/:id')
  @ApiOperation({ summary: 'Delete a skill' })
  @ApiResponse({
    status: 200,
    description: 'The skill has been successfully deleted.',
  })
  async deleteSkill(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteSkill(id);
  }

  @Post(':id/projects')
  @ApiOperation({ summary: 'Create a project' })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
    type: Project,
  })
  async createProject(
    @Param('id') resumeId: string,
    @Body() data: Partial<Project>,
  ): Promise<Project> {
    return this.resumeService.createProject(resumeId, data);
  }

  @Put('projects/:id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully updated.',
    type: Project,
  })
  async updateProject(
    @Param('id') id: string,
    @Body() data: Partial<Project>,
  ): Promise<Project> {
    return this.resumeService.updateProject(id, data);
  }

  @Delete('projects/:id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully deleted.',
  })
  async deleteProject(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteProject(id);
  }

  @Post(':id/certifications')
  @ApiOperation({ summary: 'Create a certification' })
  @ApiResponse({
    status: 201,
    description: 'The certification has been successfully created.',
    type: Certification,
  })
  async createCertification(
    @Param('id') resumeId: string,
    @Body() data: Partial<Certification>,
  ): Promise<Certification> {
    return this.resumeService.createCertification(resumeId, data);
  }

  @Put('certifications/:id')
  @ApiOperation({ summary: 'Update a certification' })
  @ApiResponse({
    status: 200,
    description: 'The certification has been successfully updated.',
    type: Certification,
  })
  async updateCertification(
    @Param('id') id: string,
    @Body() data: Partial<Certification>,
  ): Promise<Certification> {
    return this.resumeService.updateCertification(id, data);
  }

  @Delete('certifications/:id')
  @ApiOperation({ summary: 'Delete a certification' })
  @ApiResponse({
    status: 200,
    description: 'The certification has been successfully deleted.',
  })
  async deleteCertification(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteCertification(id);
  }

  @Post(':id/custom-sections')
  @ApiOperation({ summary: 'Create a custom section' })
  @ApiResponse({
    status: 201,
    description: 'The custom section has been successfully created.',
    type: CustomSection,
  })
  async createCustomSection(
    @Param('id') resumeId: string,
    @Body() data: Partial<CustomSection>,
  ): Promise<CustomSection> {
    return this.resumeService.createCustomSection(resumeId, data);
  }

  @Put('custom-sections/:id')
  @ApiOperation({ summary: 'Update a custom section' })
  @ApiResponse({
    status: 200,
    description: 'The custom section has been successfully updated.',
    type: CustomSection,
  })
  async updateCustomSection(
    @Param('id') id: string,
    @Body() data: Partial<CustomSection>,
  ): Promise<CustomSection> {
    return this.resumeService.updateCustomSection(id, data);
  }

  @Delete('custom-sections/:id')
  @ApiOperation({ summary: 'Delete a custom section' })
  @ApiResponse({
    status: 200,
    description: 'The custom section has been successfully deleted.',
  })
  async deleteCustomSection(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteCustomSection(id);
  }

  @Post('custom-sections/:id/items')
  @ApiOperation({ summary: 'Create a custom item' })
  @ApiResponse({
    status: 201,
    description: 'The custom item has been successfully created.',
    type: CustomItem,
  })
  async createCustomItem(
    @Param('id') sectionId: string,
    @Body() data: Partial<CustomItem>,
  ): Promise<CustomItem> {
    return this.resumeService.createCustomItem(sectionId, data);
  }

  @Put('custom-items/:id')
  @ApiOperation({ summary: 'Update a custom item' })
  @ApiResponse({
    status: 200,
    description: 'The custom item has been successfully updated.',
    type: CustomItem,
  })
  async updateCustomItem(
    @Param('id') id: string,
    @Body() data: Partial<CustomItem>,
  ): Promise<CustomItem> {
    return this.resumeService.updateCustomItem(id, data);
  }

  @Delete('custom-items/:id')
  @ApiOperation({ summary: 'Delete a custom item' })
  @ApiResponse({
    status: 200,
    description: 'The custom item has been successfully deleted.',
  })
  async deleteCustomItem(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteCustomItem(id);
  }

  @Post(':id/versions')
  @ApiOperation({ summary: 'Create a resume version' })
  @ApiResponse({
    status: 201,
    description: 'The resume version has been successfully created.',
    type: ResumeVersion,
  })
  async createResumeVersion(
    @Param('id') resumeId: string,
    @Body() data: Partial<ResumeVersion>,
  ): Promise<ResumeVersion> {
    return this.resumeService.createResumeVersion(resumeId, data);
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get all versions of a resume' })
  @ApiResponse({
    status: 200,
    description: 'Return all versions of the resume.',
    type: [ResumeVersion],
  })
  async getResumeVersions(
    @Param('id') resumeId: string,
  ): Promise<ResumeVersion[]> {
    return this.resumeService.getResumeVersions(resumeId);
  }
}
