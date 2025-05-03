import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Resume } from './resume.entity';

@Entity('certifications')
export class Certification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  issuer: string;

  @Column()
  issueDate: Date;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  credentialId: string;

  @Column({ nullable: true })
  credentialUrl: string;

  @Column()
  itemOrder: number;

  @ManyToOne(() => Resume, (resume) => resume.certifications)
  resume: Resume;

  @Column()
  resumeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 