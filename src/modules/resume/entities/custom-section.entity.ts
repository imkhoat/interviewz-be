import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resume } from './resume.entity';
import { CustomItem } from './custom-item.entity';

@Entity()
export class CustomSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resumeId: string;

  @Column()
  title: string;

  @Column({ type: 'integer' })
  sectionOrder: number;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => Resume, (resume) => resume.customSections)
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @OneToMany(() => CustomItem, (item) => item.section, { cascade: true })
  items: CustomItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
