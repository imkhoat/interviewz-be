import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @InjectRepository(ResumeDetail)
    private resumeDetailRepository: Repository<ResumeDetail>,
    @InjectRepository(ResumeSection)
    private resumeSectionRepository: Repository<ResumeSection>,
    @InjectRepository(WorkExperience)
    private workExperienceRepository: Repository<WorkExperience>,
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Certification)
    private certificationRepository: Repository<Certification>,
    @InjectRepository(CustomSection)
    private customSectionRepository: Repository<CustomSection>,
    @InjectRepository(CustomItem)
    private customItemRepository: Repository<CustomItem>,
    @InjectRepository(ResumeVersion)
    private resumeVersionRepository: Repository<ResumeVersion>,
  ) {}

  async createResume(userId: number, data: Partial<Resume>): Promise<Resume> {
    const resume = this.resumeRepository.create({
      ...data,
      userId,
    });
    return this.resumeRepository.save(resume);
  }

  async getResumeById(id: string): Promise<Resume | null> {
    return this.resumeRepository.findOne({
      where: { id },
      relations: [
        'detail',
        'sections',
        'workExperiences',
        'educations',
        'skills',
        'projects',
        'certifications',
        'customSections',
        'customSections.items',
        'versions',
      ],
    });
  }

  async getResumesByUserId(userId: number): Promise<Resume[]> {
    return this.resumeRepository.find({
      where: { userId },
      relations: [
        'detail',
        'sections',
        'workExperiences',
        'educations',
        'skills',
        'projects',
        'certifications',
        'customSections',
        'customSections.items',
        'versions',
      ],
    });
  }

  async updateResume(
    id: string,
    data: Partial<Resume>,
  ): Promise<Resume | null> {
    await this.resumeRepository.update(id, data);
    return this.getResumeById(id);
  }

  async deleteResume(id: string): Promise<void> {
    await this.resumeRepository.delete(id);
  }

  async createResumeDetail(
    resumeId: string,
    data: Partial<ResumeDetail>,
  ): Promise<ResumeDetail> {
    const detail = this.resumeDetailRepository.create({
      ...data,
      resumeId,
    });
    return this.resumeDetailRepository.save(detail);
  }

  async updateResumeDetail(
    id: string,
    data: Partial<ResumeDetail>,
  ): Promise<ResumeDetail | null> {
    await this.resumeDetailRepository.update(id, data);
    return this.resumeDetailRepository.findOne({ where: { id } });
  }

  async createResumeSection(
    resumeId: string,
    data: Partial<ResumeSection>,
  ): Promise<ResumeSection | null> {
    const section = this.resumeSectionRepository.create({
      ...data,
      resumeId,
    });
    return this.resumeSectionRepository.save(section);
  }

  async updateResumeSection(
    id: string,
    data: Partial<ResumeSection>,
  ): Promise<ResumeSection | null> {
    await this.resumeSectionRepository.update(id, data);
    return this.resumeSectionRepository.findOne({ where: { id } });
  }

  async deleteResumeSection(id: string): Promise<void> {
    await this.resumeSectionRepository.delete(id);
  }

  async createWorkExperience(
    resumeId: string,
    data: Partial<WorkExperience>,
  ): Promise<WorkExperience> {
    const experience = this.workExperienceRepository.create({
      ...data,
      resumeId,
    });
    return this.workExperienceRepository.save(experience);
  }

  async updateWorkExperience(
    id: string,
    data: Partial<WorkExperience>,
  ): Promise<WorkExperience | null> {
    await this.workExperienceRepository.update(id, data);
    return this.workExperienceRepository.findOne({ where: { id } });
  }

  async deleteWorkExperience(id: string): Promise<void> {
    await this.workExperienceRepository.delete(id);
  }

  async createEducation(
    resumeId: string,
    data: Partial<Education>,
  ): Promise<Education> {
    const education = this.educationRepository.create({
      ...data,
      resumeId,
    });
    return this.educationRepository.save(education);
  }

  async updateEducation(
    id: string,
    data: Partial<Education>,
  ): Promise<Education | null> {
    await this.educationRepository.update(id, data);
    return this.educationRepository.findOne({ where: { id } });
  }

  async deleteEducation(id: string): Promise<void> {
    await this.educationRepository.delete(id);
  }

  async createSkill(resumeId: string, data: Partial<Skill>): Promise<Skill> {
    const skill = this.skillRepository.create({
      ...data,
      resumeId,
    });
    return this.skillRepository.save(skill);
  }

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill | null> {
    await this.skillRepository.update(id, data);
    return this.skillRepository.findOne({ where: { id } });
  }

  async deleteSkill(id: string): Promise<void> {
    await this.skillRepository.delete(id);
  }

  async createProject(
    resumeId: string,
    data: Partial<Project>,
  ): Promise<Project> {
    const project = this.projectRepository.create({
      ...data,
      resumeId,
    });
    return this.projectRepository.save(project);
  }

  async updateProject(
    id: string,
    data: Partial<Project>,
  ): Promise<Project | null> {
    await this.projectRepository.update(id, data);
    return this.projectRepository.findOne({ where: { id } });
  }

  async deleteProject(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }

  async createCertification(
    resumeId: string,
    data: Partial<Certification>,
  ): Promise<Certification> {
    const certification = this.certificationRepository.create({
      ...data,
      resumeId,
    });
    return this.certificationRepository.save(certification);
  }

  async updateCertification(
    id: string,
    data: Partial<Certification>,
  ): Promise<Certification | null> {
    await this.certificationRepository.update(id, data);
    return this.certificationRepository.findOne({ where: { id } });
  }

  async deleteCertification(id: string): Promise<void> {
    await this.certificationRepository.delete(id);
  }

  async createCustomSection(
    resumeId: string,
    data: Partial<CustomSection>,
  ): Promise<CustomSection | null> {
    const section = this.customSectionRepository.create({
      ...data,
      resumeId,
    });
    return this.customSectionRepository.save(section);
  }

  async updateCustomSection(
    id: string,
    data: Partial<CustomSection>,
  ): Promise<CustomSection | null> {
    await this.customSectionRepository.update(id, data);
    return this.customSectionRepository.findOne({ where: { id } });
  }

  async deleteCustomSection(id: string): Promise<void> {
    await this.customSectionRepository.delete(id);
  }

  async createCustomItem(
    sectionId: string,
    data: Partial<CustomItem>,
  ): Promise<CustomItem> {
    const item = this.customItemRepository.create({
      ...data,
      sectionId,
    });
    return this.customItemRepository.save(item);
  }

  async updateCustomItem(
    id: string,
    data: Partial<CustomItem>,
  ): Promise<CustomItem | null> {
    await this.customItemRepository.update(id, data);
    return this.customItemRepository.findOne({ where: { id } });
  }

  async deleteCustomItem(id: string): Promise<void> {
    await this.customItemRepository.delete(id);
  }

  async createResumeVersion(
    resumeId: string,
    data: Partial<ResumeVersion>,
  ): Promise<ResumeVersion> {
    const version = this.resumeVersionRepository.create({
      ...data,
      resumeId,
    });
    return this.resumeVersionRepository.save(version);
  }

  async getResumeVersions(resumeId: string): Promise<ResumeVersion[]> {
    return this.resumeVersionRepository.find({
      where: { resumeId },
      order: { version: 'DESC' },
    });
  }
}
