import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Menu } from '../../menu/entities/menu.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ length: 50, unique: true })
  code: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[];

  @ManyToMany(() => Menu, (menu) => menu.permissions)
  menus?: Menu[];
} 