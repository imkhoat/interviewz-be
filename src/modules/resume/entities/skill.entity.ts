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
export class Skill {
  @ApiProperty({ description: 'The unique identifier of the skill' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the skill' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The level of proficiency', required: false })
  @Column({ nullable: true })
  level?: string;

  @ApiProperty({ description: 'The years of experience', required: false })
  @Column({ nullable: true })
  yearsOfExperience?: number;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'The date when the skill was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the skill was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => Resume,
    description: 'The resume this skill belongs to',
  })
  @ManyToOne(() => Resume, (resume) => resume.skills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;
}
