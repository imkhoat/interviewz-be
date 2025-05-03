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
export class Education {
  @ApiProperty({ description: 'The unique identifier of the education' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resumeId: string;

  @ApiProperty({ description: 'The degree or qualification' })
  @Column()
  institution: string;

  @ApiProperty({ description: 'The degree or qualification' })
  @Column()
  degree: string;

  @ApiProperty({ description: 'The location of the institution' })
  @Column({ nullable: true })
  location?: string;

  @ApiProperty({ description: 'The start date of the education' })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the education',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @ApiProperty({
    description: 'Whether the education is current',
    required: false,
  })
  @Column({ default: false })
  isCurrent: boolean;

  @ApiProperty({
    description: 'The description of the education',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', nullable: true, precision: 4, scale: 2 })
  gpa?: number;

  @Column({ type: 'integer' })
  itemOrder: number;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({
    type: () => Resume,
    description: 'The resume this education belongs to',
  })
  @ManyToOne(() => Resume, (resume) => resume.educations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @ApiProperty({ description: 'The date when the education was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the education was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
