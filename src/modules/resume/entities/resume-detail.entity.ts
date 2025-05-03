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

@Entity()
export class ResumeDetail {
  @ApiProperty({ description: 'The unique identifier of the resume detail' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resumeId: string;

  @ApiProperty({ description: 'The full name of the person', required: false })
  @Column({ nullable: true })
  fullName?: string;

  @ApiProperty({ description: 'The email address', required: false })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ description: 'The phone number', required: false })
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ description: 'The location', required: false })
  @Column({ nullable: true })
  location?: string;

  @ApiProperty({ description: 'The website URL', required: false })
  @Column({ nullable: true })
  website?: string;

  @ApiProperty({ description: 'The professional summary', required: false })
  @Column({ nullable: true })
  summary?: string;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({
    type: () => Resume,
    description: 'The resume this detail belongs to',
  })
  @ManyToOne(() => Resume, (resume) => resume.detail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @ApiProperty({ description: 'The date when the detail was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the detail was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
