import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from '../entities/resume.entity';
import { ResumeVersion } from '../entities/resume-version.entity';
import { ResumeDetail } from '../entities/resume-detail.entity';
import { ResumeSection } from '../entities/resume-section.entity';
import { WorkExperience } from '../entities/work-experience.entity';
import { Education } from '../entities/education.entity';
import { Skill } from '../entities/skill.entity';
import { Project } from '../entities/project.entity';
import { Certification } from '../entities/certification.entity';
import { CustomSection } from '../entities/custom-section.entity';
import { CustomItem } from '../entities/custom-item.entity';
import { SectionType } from '../entities/resume-section.entity';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
    @InjectRepository(ResumeVersion)
    private readonly versionRepository: Repository<ResumeVersion>,
    @InjectRepository(ResumeDetail)
    private readonly detailRepository: Repository<ResumeDetail>,
    @InjectRepository(ResumeSection)
    private readonly sectionRepository: Repository<ResumeSection>,
    @InjectRepository(WorkExperience)
    private readonly experienceRepository: Repository<WorkExperience>,
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Certification)
    private readonly certificationRepository: Repository<Certification>,
    @InjectRepository(CustomSection)
    private readonly customSectionRepository: Repository<CustomSection>,
    @InjectRepository(CustomItem)
    private readonly customItemRepository: Repository<CustomItem>
  ) {}

  // Resume CRUD operations
  async create(userId: string, data: Partial<Resume>): Promise<Resume> {
    const resume = this.resumeRepository.create({
      ...data,
      userId
    });
    return this.resumeRepository.save(resume);
  }

  async findAll(userId: string): Promise<Resume[]> {
    return this.resumeRepository.find({
      where: { userId },
      relations: ['detail', 'sections', 'versions']
    });
  }

  async findOne(id: string, userId: string): Promise<Resume> {
    const resume = await this.resumeRepository.findOne({
      where: { id, userId },
      relations: [
        'detail',
        'sections',
        'versions',
        'workExperiences',
        'educations',
        'skills',
        'projects',
        'certifications',
        'customSections',
        'customSections.items'
      ]
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async update(id: string, userId: string, data: Partial<Resume>): Promise<Resume> {
    const resume = await this.findOne(id, userId);
    Object.assign(resume, data);
    return this.resumeRepository.save(resume);
  }

  async remove(id: string, userId: string): Promise<void> {
    const resume = await this.findOne(id, userId);
    await this.resumeRepository.softRemove(resume);
  }

  // Resume Detail operations
  async updateDetail(resumeId: string, userId: string, data: Partial<ResumeDetail>): Promise<ResumeDetail> {
    const resume = await this.findOne(resumeId, userId);
    let detail = await this.detailRepository.findOne({ where: { resumeId } });

    if (!detail) {
      detail = this.detailRepository.create({ resumeId });
    }

    Object.assign(detail, data);
    return this.detailRepository.save(detail);
  }

  // Section operations
  async updateSections(resumeId: string, userId: string, sections: Partial<ResumeSection>[]): Promise<ResumeSection[]> {
    await this.findOne(resumeId, userId);
    await this.sectionRepository.delete({ resumeId });
    
    const newSections = sections.map(section => 
      this.sectionRepository.create({ ...section, resumeId })
    );
    
    return this.sectionRepository.save(newSections);
  }

  // Work Experience operations
  async addExperience(resumeId: string, userId: string, data: Partial<WorkExperience>): Promise<WorkExperience> {
    await this.findOne(resumeId, userId);
    const experience = this.experienceRepository.create({
      ...data,
      resumeId
    });
    return this.experienceRepository.save(experience);
  }

  async updateExperience(id: string, resumeId: string, userId: string, data: Partial<WorkExperience>): Promise<WorkExperience> {
    await this.findOne(resumeId, userId);
    const experience = await this.experienceRepository.findOne({ where: { id, resumeId } });
    
    if (!experience) {
      throw new NotFoundException('Work experience not found');
    }

    Object.assign(experience, data);
    return this.experienceRepository.save(experience);
  }

  async removeExperience(id: string, resumeId: string, userId: string): Promise<void> {
    await this.findOne(resumeId, userId);
    const experience = await this.experienceRepository.findOne({ where: { id, resumeId } });
    
    if (!experience) {
      throw new NotFoundException('Work experience not found');
    }

    await this.experienceRepository.remove(experience);
  }

  // Education operations
  async addEducation(resumeId: string, userId: string, data: Partial<Education>): Promise<Education> {
    await this.findOne(resumeId, userId);
    const education = this.educationRepository.create({
      ...data,
      resumeId
    });
    return this.educationRepository.save(education);
  }

  async updateEducation(id: string, resumeId: string, userId: string, data: Partial<Education>): Promise<Education> {
    await this.findOne(resumeId, userId);
    const education = await this.educationRepository.findOne({ where: { id, resumeId } });
    
    if (!education) {
      throw new NotFoundException('Education not found');
    }

    Object.assign(education, data);
    return this.educationRepository.save(education);
  }

  async removeEducation(id: string, resumeId: string, userId: string): Promise<void> {
    await this.findOne(resumeId, userId);
    const education = await this.educationRepository.findOne({ where: { id, resumeId } });
    
    if (!education) {
      throw new NotFoundException('Education not found');
    }

    await this.educationRepository.remove(education);
  }

  // Skill operations
  async addSkill(resumeId: string, userId: string, data: Partial<Skill>): Promise<Skill> {
    await this.findOne(resumeId, userId);
    const skill = this.skillRepository.create({
      ...data,
      resumeId
    });
    return this.skillRepository.save(skill);
  }

  async updateSkill(id: string, resumeId: string, userId: string, data: Partial<Skill>): Promise<Skill> {
    await this.findOne(resumeId, userId);
    const skill = await this.skillRepository.findOne({ where: { id, resumeId } });
    
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    Object.assign(skill, data);
    return this.skillRepository.save(skill);
  }

  async removeSkill(id: string, resumeId: string, userId: string): Promise<void> {
    await this.findOne(resumeId, userId);
    const skill = await this.skillRepository.findOne({ where: { id, resumeId } });
    
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    await this.skillRepository.remove(skill);
  }

  // Project operations
  async addProject(resumeId: string, userId: string, data: Partial<Project>): Promise<Project> {
    await this.findOne(resumeId, userId);
    const project = this.projectRepository.create({
      ...data,
      resumeId
    });
    return this.projectRepository.save(project);
  }

  async updateProject(id: string, resumeId: string, userId: string, data: Partial<Project>): Promise<Project> {
    await this.findOne(resumeId, userId);
    const project = await this.projectRepository.findOne({ where: { id, resumeId } });
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    Object.assign(project, data);
    return this.projectRepository.save(project);
  }

  async removeProject(id: string, resumeId: string, userId: string): Promise<void> {
    await this.findOne(resumeId, userId);
    const project = await this.projectRepository.findOne({ where: { id, resumeId } });
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.remove(project);
  }

  // Certification operations
  async addCertification(resumeId: string, userId: string, data: Partial<Certification>): Promise<Certification> {
    await this.findOne(resumeId, userId);
    const certification = this.certificationRepository.create({
      ...data,
      resumeId
    });
    return this.certificationRepository.save(certification);
  }

  async updateCertification(id: string, resumeId: string, userId: string, data: Partial<Certification>): Promise<Certification> {
    await this.findOne(resumeId, userId);
    const certification = await this.certificationRepository.findOne({ where: { id, resumeId } });
    
    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    Object.assign(certification, data);
    return this.certificationRepository.save(certification);
  }

  async removeCertification(id: string, resumeId: string, userId: string): Promise<void> {
    await this.findOne(resumeId, userId);
    const certification = await this.certificationRepository.findOne({ where: { id, resumeId } });
    
    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    await this.certificationRepository.remove(certification);
  }

  // Custom Section operations
  async addCustomSection(resumeId: string, userId: string, data: Partial<CustomSection>): Promise<CustomSection> {
    await this.findOne(resumeId, userId);
    const section = this.customSectionRepository.create({
      ...data,
      resumeId
    });
    return this.customSectionRepository.save(section);
  }

  async updateCustomSection(id: string, resumeId: string, userId: string, data: Partial<CustomSection>): Promise<CustomSection> {
    await this.findOne(resumeId, userId);
    const section = await this.customSectionRepository.findOne({ where: { id, resumeId } });
    
    if (!section) {
      throw new NotFoundException('Custom section not found');
    }

    Object.assign(section, data);
    return this.customSectionRepository.save(section);
  }

  async removeCustomSection(id: string, resumeId: string, userId: string): Promise<void> {
    await this.findOne(resumeId, userId);
    const section = await this.customSectionRepository.findOne({ where: { id, resumeId } });
    
    if (!section) {
      throw new NotFoundException('Custom section not found');
    }

    await this.customSectionRepository.remove(section);
  }

  // Custom Item operations
  async addCustomItem(sectionId: string, resumeId: string, userId: string, data: Partial<CustomItem>): Promise<CustomItem> {
    await this.findOne(resumeId, userId);
    const section = await this.customSectionRepository.findOne({ where: { id: sectionId, resumeId } });
    
    if (!section) {
      throw new NotFoundException('Custom section not found');
    }

    const item = this.customItemRepository.create({
      ...data,
      customSectionId: sectionId
    });
    return this.customItemRepository.save(item);
  }

  async updateCustomItem(id: string, sectionId: string, resumeId: string, userId: string, data: Partial<CustomItem>): Promise<CustomItem> {
    await this.findOne(resumeId, userId);
    const section = await this.customSectionRepository.findOne({ where: { id: sectionId, resumeId } });
    
    if (!section) {
      throw new NotFoundException('Custom section not found');
    }

    const item = await this.customItemRepository.findOne({ where: { id, customSectionId: sectionId } });
    
    if (!item) {
      throw new NotFoundException('Custom item not found');
    }

    Object.assign(item, data);
    return this.customItemRepository.save(item);
  }

  async removeCustomItem(id: string, sectionId: string, resumeId: string, userId: string): Promise<void> {
    await this.findOne(resumeId, userId);
    const section = await this.customSectionRepository.findOne({ where: { id: sectionId, resumeId } });
    
    if (!section) {
      throw new NotFoundException('Custom section not found');
    }

    const item = await this.customItemRepository.findOne({ where: { id, customSectionId: sectionId } });
    
    if (!item) {
      throw new NotFoundException('Custom item not found');
    }

    await this.customItemRepository.remove(item);
  }

  // Version operations
  async addVersion(resumeId: string, userId: string, data: Partial<ResumeVersion>): Promise<ResumeVersion> {
    await this.findOne(resumeId, userId);
    const version = this.versionRepository.create({
      ...data,
      resumeId
    });
    return this.versionRepository.save(version);
  }

  async getVersions(resumeId: string, userId: string): Promise<ResumeVersion[]> {
    await this.findOne(resumeId, userId);
    return this.versionRepository.find({ where: { resumeId } });
  }
} 