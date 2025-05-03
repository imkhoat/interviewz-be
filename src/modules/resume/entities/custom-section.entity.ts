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
import { ApiProperty } from '@nestjs/swagger';
import { Resume } from './resume.entity';
import { CustomItem } from './custom-item.entity';

@Entity()
export class CustomSection {
  @ApiProperty({ description: 'The unique identifier of the custom section' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The title of the custom section' })
  @Column()
  title: string;

  @ApiProperty({
    description: 'The description of the custom section',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'The order of the section in the resume' })
  @Column({ type: 'integer' })
  sectionOrder: number;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'The date when the custom section was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the custom section was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => Resume,
    description: 'The resume this custom section belongs to',
  })
  @ManyToOne(() => Resume, (resume) => resume.customSections)
  @JoinColumn({ name: 'resumeId' })
  resume: Resume;

  @ApiProperty({
    type: () => [CustomItem],
    description: 'The items in this custom section',
  })
  @OneToMany(() => CustomItem, (item) => item.section, { cascade: true })
  items: CustomItem[];
}
