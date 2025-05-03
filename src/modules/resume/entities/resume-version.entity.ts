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
export class ResumeVersion {
  @ApiProperty({ description: 'The unique identifier of the resume version' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The version number' })
  @Column()
  version: string;

  @ApiProperty({ description: 'The content of the resume version' })
  @Column({ type: 'jsonb' })
  content: Record<string, any>;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'The date when the resume version was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the resume version was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => Resume,
    description: 'The resume this version belongs to',
  })
  @ManyToOne(() => Resume, (resume) => resume.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;
}
