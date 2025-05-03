import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
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

@Controller('resumes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @Roles(Role.USER)
  async create(@Req() req: RequestWithUser, @Body() data: Partial<Resume>) {
    return this.resumeService.create(req.user.id.toString(), data);
  }

  @Get()
  @Roles(Role.USER)
  async findAll(@Req() req: RequestWithUser) {
    return this.resumeService.findAll(req.user.id.toString());
  }

  @Get(':id')
  @Roles(Role.USER)
  async findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.resumeService.findOne(id, req.user.id.toString());
  }

  @Put(':id')
  @Roles(Role.USER)
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: Partial<Resume>
  ) {
    return this.resumeService.update(id, req.user.id.toString(), data);
  }

  @Delete(':id')
  @Roles(Role.USER)
  async remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.resumeService.remove(id, req.user.id.toString());
  }

  // Resume Detail endpoints
  @Put(':id/detail')
  @Roles(Role.USER)
  async updateDetail(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: Partial<ResumeDetail>
  ) {
    return this.resumeService.updateDetail(id, req.user.id.toString(), data);
  }

  // Section endpoints
  @Put(':id/sections')
  @Roles(Role.USER)
  async updateSections(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() sections: Partial<ResumeSection>[]
  ) {
    return this.resumeService.updateSections(id, req.user.id.toString(), sections);
  }

  // Work Experience endpoints
  @Post(':id/experiences')
  @Roles(Role.USER)
  async addExperience(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: Partial<WorkExperience>
  ) {
    return this.resumeService.addExperience(id, req.user.id.toString(), data);
  }

  @Put(':id/experiences/:experienceId')
  @Roles(Role.USER)
  async updateExperience(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('experienceId') experienceId: string,
    @Body() data: Partial<WorkExperience>
  ) {
    return this.resumeService.updateExperience(experienceId, id, req.user.id.toString(), data);
  }

  @Delete(':id/experiences/:experienceId')
  @Roles(Role.USER)
  async removeExperience(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('experienceId') experienceId: string
  ) {
    return this.resumeService.removeExperience(experienceId, id, req.user.id.toString());
  }

  // Education endpoints
  @Post(':id/educations')
  @Roles(Role.USER)
  async addEducation(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: Partial<Education>
  ) {
    return this.resumeService.addEducation(id, req.user.id.toString(), data);
  }

  @Put(':id/educations/:educationId')
  @Roles(Role.USER)
  async updateEducation(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('educationId') educationId: string,
    @Body() data: Partial<Education>
  ) {
    return this.resumeService.updateEducation(educationId, id, req.user.id.toString(), data);
  }

  @Delete(':id/educations/:educationId')
  @Roles(Role.USER)
  async removeEducation(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('educationId') educationId: string
  ) {
    return this.resumeService.removeEducation(educationId, id, req.user.id.toString());
  }

  // Skill endpoints
  @Post(':id/skills')
  @Roles(Role.USER)
  async addSkill(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: Partial<Skill>
  ) {
    return this.resumeService.addSkill(id, req.user.id.toString(), data);
  }

  @Put(':id/skills/:skillId')
  @Roles(Role.USER)
  async updateSkill(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('skillId') skillId: string,
    @Body() data: Partial<Skill>
  ) {
    return this.resumeService.updateSkill(skillId, id, req.user.id.toString(), data);
  }

  @Delete(':id/skills/:skillId')
  @Roles(Role.USER)
  async removeSkill(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('skillId') skillId: string
  ) {
    return this.resumeService.removeSkill(skillId, id, req.user.id.toString());
  }

  // Project endpoints
  @Post(':id/projects')
  @Roles(Role.USER)
  async addProject(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: Partial<Project>
  ) {
    return this.resumeService.addProject(id, req.user.id.toString(), data);
  }

  @Put(':id/projects/:projectId')
  @Roles(Role.USER)
  async updateProject(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('projectId') projectId: string,
    @Body() data: Partial<Project>
  ) {
    return this.resumeService.updateProject(projectId, id, req.user.id.toString(), data);
  }

  @Delete(':id/projects/:projectId')
  @Roles(Role.USER)
  async removeProject(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('projectId') projectId: string
  ) {
    return this.resumeService.removeProject(projectId, id, req.user.id.toString());
  }

  // Certification endpoints
  @Post(':id/certifications')
  @Roles(Role.USER)
  async addCertification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: Partial<Certification>
  ) {
    return this.resumeService.addCertification(id, req.user.id.toString(), data);
  }

  @Put(':id/certifications/:certificationId')
  @Roles(Role.USER)
  async updateCertification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('certificationId') certificationId: string,
    @Body() data: Partial<Certification>
  ) {
    return this.resumeService.updateCertification(certificationId, id, req.user.id.toString(), data);
  }

  @Delete(':id/certifications/:certificationId')
  @Roles(Role.USER)
  async removeCertification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('certificationId') certificationId: string
  ) {
    return this.resumeService.removeCertification(certificationId, id, req.user.id.toString());
  }

  // Custom Section endpoints
  @Post(':id/custom-sections')
  @Roles(Role.USER)
  async addCustomSection(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: Partial<CustomSection>
  ) {
    return this.resumeService.addCustomSection(id, req.user.id.toString(), data);
  }

  @Put(':id/custom-sections/:sectionId')
  @Roles(Role.USER)
  async updateCustomSection(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body() data: Partial<CustomSection>
  ) {
    return this.resumeService.updateCustomSection(sectionId, id, req.user.id.toString(), data);
  }

  @Delete(':id/custom-sections/:sectionId')
  @Roles(Role.USER)
  async removeCustomSection(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string
  ) {
    return this.resumeService.removeCustomSection(sectionId, id, req.user.id.toString());
  }

  // Custom Item endpoints
  @Post(':id/custom-sections/:sectionId/items')
  @Roles(Role.USER)
  async addCustomItem(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body() data: Partial<CustomItem>
  ) {
    return this.resumeService.addCustomItem(sectionId, id, req.user.id.toString(), data);
  }

  @Put(':id/custom-sections/:sectionId/items/:itemId')
  @Roles(Role.USER)
  async updateCustomItem(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Param('itemId') itemId: string,
    @Body() data: Partial<CustomItem>
  ) {
    return this.resumeService.updateCustomItem(itemId, sectionId, id, req.user.id.toString(), data);
  }

  @Delete(':id/custom-sections/:sectionId/items/:itemId')
  @Roles(Role.USER)
  async removeCustomItem(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Param('itemId') itemId: string
  ) {
    return this.resumeService.removeCustomItem(itemId, sectionId, id, req.user.id);
  }

  // Version endpoints
  @Post(':id/versions')
  @Roles(Role.USER)
  async addVersion(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: Partial<ResumeVersion>
  ) {
    return this.resumeService.addVersion(id, req.user.id, data);
  }

  @Get(':id/versions')
  @Roles(Role.USER)
  async getVersions(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.resumeService.getVersions(id, req.user.id);
  }
} 