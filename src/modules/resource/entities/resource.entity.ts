import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../role/entities/role.entity';

@Entity('resources')
export class Resource {
  @ApiProperty({ description: 'The unique identifier of the resource' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the resource' })
  @Column({ length: 50, unique: true })
  name: string;

  @ApiProperty({
    description: 'The description of the resource',
    required: false,
  })
  @Column({ length: 255, nullable: true })
  description?: string;

  @ApiProperty({ description: 'The type of the resource' })
  @Column({ length: 50 })
  type: string;

  @ApiProperty({ description: 'The path of the resource' })
  @Column()
  path: string;

  @ApiProperty({ description: 'The method of the resource' })
  @Column()
  method: string;

  @ApiProperty({ description: 'Whether the resource is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'json', nullable: true })
  attributes?: Record<string, any>;

  @ApiProperty({ description: 'The date when the resource was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the resource was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => [Role],
    description: 'The roles that have access to this resource',
  })
  @ManyToMany(() => Role, (role) => role.resources)
  @JoinTable()
  roles: Role[];
}
