import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Resume } from './resume.entity';
import { CustomItem } from './custom-item.entity';

@Entity('custom_sections')
export class CustomSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  sectionOrder: number;

  @Column({ default: true })
  isVisible: boolean;

  @ManyToOne(() => Resume, (resume) => resume.customSections)
  resume: Resume;

  @Column()
  resumeId: string;

  @OneToMany(() => CustomItem, (item) => item.customSection)
  items: CustomItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 