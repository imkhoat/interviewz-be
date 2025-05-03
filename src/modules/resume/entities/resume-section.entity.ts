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
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ description: 'The unique identifier of the section' })
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

  @ApiProperty({ description: 'The title of the section' })
  @Column()
  title: string;

  @ApiProperty({ description: 'The content of the section', required: false })
  @Column({ type: 'text', nullable: true })
  content?: string;

  @ApiProperty({ description: 'The order of the section in the resume' })
  @Column({ type: 'integer' })
  sectionOrder: number;

  @Column({ default: true })
  isVisible: boolean;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({
    type: () => Resume,
    description: 'The resume this section belongs to',
  })
  @ManyToOne(() => Resume, (resume) => resume.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @ApiProperty({ description: 'The date when the section was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the section was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
