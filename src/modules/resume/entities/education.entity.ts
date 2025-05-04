import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resume } from '@modules/resume/entities/resume.entity';

@Entity()
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resumeId: string;

  @Column()
  institution: string;

  @Column()
  degree: string;

  @Column({ nullable: true })
  field?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', nullable: true, precision: 4, scale: 2 })
  gpa?: number;

  @Column({ type: 'integer' })
  itemOrder: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => Resume, (resume) => resume.educations)
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
