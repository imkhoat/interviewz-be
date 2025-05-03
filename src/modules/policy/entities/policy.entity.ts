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

@Entity('policies')
export class Policy {
  @ApiProperty({ description: 'The unique identifier of the policy' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the policy' })
  @Column({ length: 50, unique: true })
  name: string;

  @ApiProperty({
    description: 'The description of the policy',
    required: false,
  })
  @Column({ length: 255, nullable: true })
  description?: string;

  @ApiProperty({ description: 'The resource this policy applies to' })
  @Column({ length: 50, nullable: true })
  resource?: string;

  @ApiProperty({ description: 'The action this policy allows' })
  @Column({ length: 50, nullable: true })
  action?: string;

  @ApiProperty({
    description: 'The conditions for this policy',
    required: false,
  })
  @Column({ type: 'json', nullable: true })
  conditions?: Record<string, any>;

  @ApiProperty({ description: 'Whether the policy is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'The date when the policy was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the policy was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => [Role],
    description: 'The roles that have this policy',
  })
  @ManyToMany(() => Role, (role) => role.policies)
  @JoinTable()
  roles?: Role[];
}
