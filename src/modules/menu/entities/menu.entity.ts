import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@modules/role/entities/role.entity';
import { Permission } from '@modules/permission/entities/permission.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, nullable: true })
  path?: string;

  @Column({ length: 50, nullable: true })
  icon?: string;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => Menu, (menu) => menu.children)
  @JoinColumn({ name: 'parentId' })
  parent?: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children?: Menu[];

  @ManyToMany(() => Role, (role) => role.menus)
  roles?: Role[];

  @ManyToMany(() => Permission, (permission) => permission.menus)
  permissions?: Permission[];
}
