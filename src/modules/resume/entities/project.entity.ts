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
export class Project {
  @ApiProperty({ description: 'The unique identifier of the project' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the project' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The description of the project',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'The start date of the project' })
  @Column()
  startDate: Date;

  @ApiProperty({ description: 'The end date of the project', required: false })
  @Column({ nullable: true })
  endDate?: Date;

  @ApiProperty({
    description: 'Whether the project is current',
    required: false,
  })
  @Column({ default: false })
  isCurrent: boolean;

  @ApiProperty({ description: 'The URL of the project', required: false })
  @Column({ nullable: true })
  url?: string;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'The date when the project was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the project was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => Resume,
    description: 'The resume this project belongs to',
  })
  @ManyToOne(() => Resume, (resume) => resume.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;
}
