import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ResumeDetail } from './resume-detail.entity';
import { ResumeSection } from './resume-section.entity';
import { WorkExperience } from './work-experience.entity';
import { Education } from './education.entity';
import { Skill } from './skill.entity';
import { Project } from './project.entity';
import { Certification } from './certification.entity';
import { CustomSection } from './custom-section.entity';
import { ResumeVersion } from './resume-version.entity';

@Entity()
export class Resume {
  @ApiProperty({ description: 'The unique identifier of the resume' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The title of the resume' })
  @Column()
  title: string;

  @ApiProperty({
    description: 'The description of the resume',
    required: false,
  })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'The ID of the user who owns this resume' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'The date when the resume was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the resume was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => ResumeDetail,
    description: 'The detail information of the resume',
  })
  @OneToOne(() => ResumeDetail, (detail) => detail.resume, { cascade: true })
  @JoinColumn({ name: 'resumeId' })
  detail: ResumeDetail;

  @ApiProperty({
    type: () => [ResumeSection],
    description: 'The sections of the resume',
  })
  @OneToMany(() => ResumeSection, (section) => section.resume, {
    cascade: true,
  })
  sections: ResumeSection[];

  @ApiProperty({
    type: () => [WorkExperience],
    description: 'The work experiences in the resume',
  })
  @OneToMany(() => WorkExperience, (experience) => experience.resume, {
    cascade: true,
  })
  experiences: WorkExperience[];

  @ApiProperty({
    type: () => [Education],
    description: 'The education history in the resume',
  })
  @OneToMany(() => Education, (education) => education.resume, {
    cascade: true,
  })
  educations: Education[];

  @ApiProperty({
    type: () => [Skill],
    description: 'The skills listed in the resume',
  })
  @OneToMany(() => Skill, (skill) => skill.resume, { cascade: true })
  skills: Skill[];

  @ApiProperty({
    type: () => [Project],
    description: 'The projects listed in the resume',
  })
  @OneToMany(() => Project, (project) => project.resume, { cascade: true })
  projects: Project[];

  @ApiProperty({
    type: () => [Certification],
    description: 'The certifications listed in the resume',
  })
  @OneToMany(() => Certification, (certification) => certification.resume, {
    cascade: true,
  })
  certifications: Certification[];

  @ApiProperty({
    type: () => [CustomSection],
    description: 'The custom sections in the resume',
  })
  @OneToMany(() => CustomSection, (section) => section.resume, {
    cascade: true,
  })
  customSections: CustomSection[];

  @ApiProperty({
    type: () => [ResumeVersion],
    description: 'The versions of the resume',
  })
  @OneToMany(() => ResumeVersion, (version) => version.resume, {
    cascade: true,
  })
  versions: ResumeVersion[];
}
