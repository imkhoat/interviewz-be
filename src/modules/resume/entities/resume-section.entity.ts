import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resume } from './resume.entity';

export enum SectionType {
  WORK_EXPERIENCE = 'WORK_EXPERIENCE',
  EDUCATION = 'EDUCATION',
  SKILLS = 'SKILLS',
  PROJECTS = 'PROJECTS',
  CERTIFICATIONS = 'CERTIFICATIONS',
  CUSTOM = 'CUSTOM',
}

@Entity()
export class ResumeSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resumeId: string;

  @Column({
    type: 'enum',
    enum: SectionType,
    default: SectionType.CUSTOM,
  })
  type: SectionType;

  @Column()
  title: string;

  @Column({ type: 'integer' })
  sectionOrder: number;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => Resume, (resume) => resume.sections)
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 