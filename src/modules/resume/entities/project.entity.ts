import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Resume } from './resume.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('text', { array: true, nullable: true })
  technologies: string[];

  @Column('text', { array: true, nullable: true })
  responsibilities: string[];

  @Column('text', { array: true, nullable: true })
  achievements: string[];

  @Column({ nullable: true })
  projectUrl: string;

  @Column()
  itemOrder: number;

  @ManyToOne(() => Resume, (resume) => resume.projects)
  resume: Resume;

  @Column()
  resumeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 