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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ResumeService } from '@modules/resume/services/resume.service';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';
import { RoleGuard } from '@modules/auth/guards/role.guard';
import { Roles } from '@modules/auth/decorators/role.decorator';
import { UserRole } from '@modules/user/enums/user-role.enum';
import { RequestWithUser } from '@modules/auth/interfaces/request.interface';
import { Resume } from '@modules/resume/entities/resume.entity';
import { ResumeDetail } from '@modules/resume/entities/resume-detail.entity';
import { ResumeSection } from '@modules/resume/entities/resume-section.entity';
import { WorkExperience } from '@modules/resume/entities/work-experience.entity';
import { Education } from '@modules/resume/entities/education.entity';
import { Skill } from '@modules/resume/entities/skill.entity';
import { Project } from '@modules/resume/entities/project.entity';
import { Certification } from '@modules/resume/entities/certification.entity';
import { CustomSection } from '@modules/resume/entities/custom-section.entity';
import { CustomItem } from '@modules/resume/entities/custom-item.entity';
import { ResumeVersion } from '@modules/resume/entities/resume-version.entity';
import { CreateResumeDto } from '@modules/resume/dto/create-resume.dto';

@Controller('resumes')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(UserRole.CANDIDATE)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resume' })
  @ApiResponse({ status: 201, description: 'Resume created successfully' })
  async createResume(
    @Req() req: RequestWithUser,
    @Body() createResumeDto: CreateResumeDto,
  ): Promise<Resume> {
    return this.resumeService.createResume(req.user.id, createResumeDto);
  }

  @Get()
  async getResumes(@Req() req: RequestWithUser): Promise<Resume[]> {
    return this.resumeService.getResumesByUserId(req.user.id);
  }

  @Get(':id')
  async getResume(@Param('id') id: string): Promise<Resume | null> {
    return this.resumeService.getResumeById(id);
  }

  @Put(':id')
  async updateResume(
    @Param('id') id: string,
    @Body() data: Partial<Resume>,
  ): Promise<Resume | null> {
    return this.resumeService.updateResume(id, data);
  }

  @Delete(':id')
  async deleteResume(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteResume(id);
  }

  @Post(':id/detail')
  async createResumeDetail(
    @Param('id') resumeId: string,
    @Body() data: Partial<ResumeDetail>,
  ): Promise<ResumeDetail> {
    return this.resumeService.createResumeDetail(resumeId, data);
  }

  @Put('detail/:id')
  async updateResumeDetail(
    @Param('id') id: string,
    @Body() data: Partial<ResumeDetail>,
  ): Promise<ResumeDetail | null> {
    return this.resumeService.updateResumeDetail(id, data);
  }

  @Post(':id/sections')
  async createResumeSection(
    @Param('id') resumeId: string,
    @Body() data: Partial<ResumeSection>,
  ): Promise<ResumeSection | null> {
    return this.resumeService.createResumeSection(resumeId, data);
  }

  @Put('sections/:id')
  async updateResumeSection(
    @Param('id') id: string,
    @Body() data: Partial<ResumeSection>,
  ): Promise<ResumeSection | null> {
    return this.resumeService.updateResumeSection(id, data);
  }

  @Delete('sections/:id')
  async deleteResumeSection(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteResumeSection(id);
  }

  @Post(':id/experiences')
  async createWorkExperience(
    @Param('id') resumeId: string,
    @Body() data: Partial<WorkExperience>,
  ): Promise<WorkExperience | null> {
    return this.resumeService.createWorkExperience(resumeId, data);
  }

  @Put('experiences/:id')
  async updateWorkExperience(
    @Param('id') id: string,
    @Body() data: Partial<WorkExperience>,
  ): Promise<WorkExperience | null> {
    return this.resumeService.updateWorkExperience(id, data);
  }

  @Delete('experiences/:id')
  async deleteWorkExperience(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteWorkExperience(id);
  }

  @Post(':id/educations')
  async createEducation(
    @Param('id') resumeId: string,
    @Body() data: Partial<Education>,
  ): Promise<Education> {
    return this.resumeService.createEducation(resumeId, data);
  }

  @Put('educations/:id')
  async updateEducation(
    @Param('id') id: string,
    @Body() data: Partial<Education>,
  ): Promise<Education | null> {
    return this.resumeService.updateEducation(id, data);
  }

  @Delete('educations/:id')
  async deleteEducation(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteEducation(id);
  }

  @Post(':id/skills')
  async createSkill(
    @Param('id') resumeId: string,
    @Body() data: Partial<Skill>,
  ): Promise<Skill> {
    return this.resumeService.createSkill(resumeId, data);
  }

  @Put('skills/:id')
  async updateSkill(
    @Param('id') id: string,
    @Body() data: Partial<Skill>,
  ): Promise<Skill | null> {
    return this.resumeService.updateSkill(id, data);
  }

  @Delete('skills/:id')
  async deleteSkill(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteSkill(id);
  }

  @Post(':id/projects')
  async createProject(
    @Param('id') resumeId: string,
    @Body() data: Partial<Project>,
  ): Promise<Project> {
    return this.resumeService.createProject(resumeId, data);
  }

  @Put('projects/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() data: Partial<Project>,
  ): Promise<Project | null> {
    return this.resumeService.updateProject(id, data);
  }

  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteProject(id);
  }

  @Post(':id/certifications')
  async createCertification(
    @Param('id') resumeId: string,
    @Body() data: Partial<Certification>,
  ): Promise<Certification> {
    return this.resumeService.createCertification(resumeId, data);
  }

  @Put('certifications/:id')
  async updateCertification(
    @Param('id') id: string,
    @Body() data: Partial<Certification>,
  ): Promise<Certification | null> {
    return this.resumeService.updateCertification(id, data);
  }

  @Delete('certifications/:id')
  async deleteCertification(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteCertification(id);
  }

  @Post(':id/custom-sections')
  async createCustomSection(
    @Param('id') resumeId: string,
    @Body() data: Partial<CustomSection>,
  ): Promise<CustomSection | null> {
    return this.resumeService.createCustomSection(resumeId, data);
  }

  @Put('custom-sections/:id')
  async updateCustomSection(
    @Param('id') id: string,
    @Body() data: Partial<CustomSection>,
  ): Promise<CustomSection | null> {
    return this.resumeService.updateCustomSection(id, data);
  }

  @Delete('custom-sections/:id')
  async deleteCustomSection(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteCustomSection(id);
  }

  @Post('custom-sections/:id/items')
  async createCustomItem(
    @Param('id') sectionId: string,
    @Body() data: Partial<CustomItem>,
  ): Promise<CustomItem | null> {
    return this.resumeService.createCustomItem(sectionId, data);
  }

  @Put('custom-items/:id')
  async updateCustomItem(
    @Param('id') id: string,
    @Body() data: Partial<CustomItem>,
  ): Promise<CustomItem | null> {
    return this.resumeService.updateCustomItem(id, data);
  }

  @Delete('custom-items/:id')
  async deleteCustomItem(@Param('id') id: string): Promise<void> {
    return this.resumeService.deleteCustomItem(id);
  }

  @Post(':id/versions')
  async createResumeVersion(
    @Param('id') resumeId: string,
    @Body() data: Partial<ResumeVersion>,
  ): Promise<ResumeVersion> {
    return this.resumeService.createResumeVersion(resumeId, data);
  }

  @Get(':id/versions')
  async getResumeVersions(
    @Param('id') resumeId: string,
  ): Promise<ResumeVersion[]> {
    return this.resumeService.getResumeVersions(resumeId);
  }
}
