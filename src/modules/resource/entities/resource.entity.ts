import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 50 })
  type: string;

  @Column({ type: 'json', nullable: true })
  attributes?: Record<string, any>;

  @Column({ length: 255, nullable: true })
  description?: string;
} 