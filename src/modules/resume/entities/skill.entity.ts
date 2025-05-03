import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Resume } from './resume.entity';

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: SkillLevel,
    nullable: true
  })
  level: SkillLevel;

  @Column({ nullable: true })
  yearsOfExperience: number;

  @Column()
  itemOrder: number;

  @ManyToOne(() => Resume, (resume) => resume.skills)
  resume: Resume;

  @Column()
  resumeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 