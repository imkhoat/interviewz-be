import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CustomSection } from './custom-section.entity';

@Entity()
export class CustomItem {
  @ApiProperty({ description: 'The unique identifier of the custom item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The title of the custom item' })
  @Column()
  title: string;

  @ApiProperty({
    description: 'The description of the custom item',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'The order of the item in the section' })
  @Column({ type: 'integer' })
  itemOrder: number;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({
    type: () => CustomSection,
    description: 'The custom section this item belongs to',
  })
  @ManyToOne(() => CustomSection, (section) => section.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sectionId' })
  section: CustomSection;

  @ApiProperty({ description: 'The date when the custom item was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the custom item was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
