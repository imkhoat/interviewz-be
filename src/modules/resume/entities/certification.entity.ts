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
export class Certification {
  @ApiProperty({ description: 'The unique identifier of the certification' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the certification' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The issuing organization' })
  @Column()
  organization: string;

  @ApiProperty({ description: 'The issue date of the certification' })
  @Column()
  issueDate: Date;

  @ApiProperty({
    description: 'The expiration date of the certification',
    required: false,
  })
  @Column({ nullable: true })
  expirationDate?: Date;

  @ApiProperty({ description: 'The credential ID', required: false })
  @Column({ nullable: true })
  credentialId?: string;

  @ApiProperty({ description: 'The credential URL', required: false })
  @Column({ nullable: true })
  credentialUrl?: string;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'The date when the certification was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the certification was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => Resume,
    description: 'The resume this certification belongs to',
  })
  @ManyToOne(() => Resume, (resume) => resume.certifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;
}
