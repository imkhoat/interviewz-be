import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Resume } from './resume.entity';

@Entity('resume_versions')
export class ResumeVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  versionNumber: number;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  fileType: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => Resume, (resume) => resume.versions)
  resume: Resume;

  @Column()
  resumeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 