import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  templateId: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.resumes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => ResumeVersion, (version) => version.resume, { cascade: true })
  versions: ResumeVersion[];

  @OneToOne(() => ResumeDetail, (detail) => detail.resume, { cascade: true })
  detail: ResumeDetail;

  @OneToMany(() => ResumeSection, (section) => section.resume, { cascade: true })
  sections: ResumeSection[];

  @OneToMany(() => WorkExperience, (experience) => experience.resume, { cascade: true })
  workExperiences: WorkExperience[];

  @OneToMany(() => Education, (education) => education.resume, { cascade: true })
  educations: Education[];

  @OneToMany(() => Skill, (skill) => skill.resume, { cascade: true })
  skills: Skill[];

  @OneToMany(() => Project, (project) => project.resume, { cascade: true })
  projects: Project[];

  @OneToMany(() => Certification, (certification) => certification.resume, { cascade: true })
  certifications: Certification[];

  @OneToMany(() => CustomSection, (section) => section.resume, { cascade: true })
  customSections: CustomSection[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 