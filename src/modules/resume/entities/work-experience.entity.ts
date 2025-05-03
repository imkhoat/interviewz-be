import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Resume } from './resume.entity';

@Entity()
export class WorkExperience {
  @ApiProperty({ description: 'The unique identifier of the work experience' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The job title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'The company name' })
  @Column()
  company: string;

  @ApiProperty({ description: 'The location of the job' })
  @Column()
  location: string;

  @ApiProperty({ description: 'The start date of the job' })
  @Column()
  startDate: Date;

  @ApiProperty({ description: 'The end date of the job', required: false })
  @Column({ nullable: true })
  endDate?: Date;

  @ApiProperty({ description: 'Whether the job is current', required: false })
  @Column({ default: false })
  isCurrent: boolean;

  @ApiProperty({ description: 'The description of the job', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'The date when the work experience was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the work experience was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => Resume,
    description: 'The resume this work experience belongs to',
  })
  @ManyToOne(() => Resume, (resume) => resume.experiences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;
}
