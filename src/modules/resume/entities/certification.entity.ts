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
export class Certification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resumeId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  issuer?: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer' })
  itemOrder: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => Resume, (resume) => resume.certifications)
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
