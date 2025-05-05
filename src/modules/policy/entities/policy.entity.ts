import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@modules/role/entities/role.entity';

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ length: 50, nullable: true })
  resource?: string;

  @Column({ length: 50, nullable: true })
  action?: string;

  @Column({ type: 'json', nullable: true })
  conditions?: Record<string, any>;

  @ManyToMany(() => Role, (role) => role.policies)
  roles?: Role[];
}
