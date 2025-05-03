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

@Entity()
export class ResumeVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resumeId: string;

  @Column()
  version: number;

  @Column({ type: 'jsonb' })
  content: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @ManyToOne(() => Resume, (resume) => resume.versions)
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
