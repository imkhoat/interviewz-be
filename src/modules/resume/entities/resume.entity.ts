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
import { ResumeDetail } from '@modules/resume/entities/resume-detail.entity';
import { ResumeSection } from '@modules/resume/entities/resume-section.entity';
import { WorkExperience } from '@modules/resume/entities/work-experience.entity';
import { Education } from '@modules/resume/entities/education.entity';
import { Skill } from '@modules/resume/entities/skill.entity';
import { Project } from '@modules/resume/entities/project.entity';
import { Certification } from '@modules/resume/entities/certification.entity';
import { CustomSection } from '@modules/resume/entities/custom-section.entity';
import { ResumeVersion } from '@modules/resume/entities/resume-version.entity';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  userId: number;

  @OneToOne(() => ResumeDetail, { cascade: true })
  @JoinColumn({ name: 'resumeId' })
  detail: ResumeDetail;

  @OneToMany(() => ResumeSection, (section) => section.resume, {
    cascade: true,
  })
  sections: ResumeSection[];

  @OneToMany(() => WorkExperience, (experience) => experience.resume, {
    cascade: true,
  })
  workExperiences: WorkExperience[];

  @OneToMany(() => Education, (education) => education.resume, {
    cascade: true,
  })
  educations: Education[];

  @OneToMany(() => Skill, (skill) => skill.resume, { cascade: true })
  skills: Skill[];

  @OneToMany(() => Project, (project) => project.resume, { cascade: true })
  projects: Project[];

  @OneToMany(() => Certification, (certification) => certification.resume, {
    cascade: true,
  })
  certifications: Certification[];

  @OneToMany(() => CustomSection, (section) => section.resume, {
    cascade: true,
  })
  customSections: CustomSection[];

  @OneToMany(() => ResumeVersion, (version) => version.resume, {
    cascade: true,
  })
  versions: ResumeVersion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
