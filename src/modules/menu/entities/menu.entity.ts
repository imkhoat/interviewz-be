import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('menus')
export class Menu {
  @ApiProperty({ description: 'The unique identifier of the menu' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the menu' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The icon of the menu', required: false })
  @Column({ nullable: true })
  icon?: string;

  @ApiProperty({ description: 'The path of the menu', required: false })
  @Column({ nullable: true })
  path?: string;

  @ApiProperty({ description: 'The order of the menu' })
  @Column()
  order: number;

  @ApiProperty({ description: 'Whether the menu is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'The date when the menu was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the menu was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => Menu,
    description: 'The parent menu',
    required: false,
  })
  @ManyToOne(() => Menu, (menu) => menu.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: Menu;

  @ApiProperty({ type: () => [Menu], description: 'The child menus' })
  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @ManyToMany(() => Role, (role) => role.menus)
  roles?: Role[];

  @ManyToMany(() => Permission, (permission) => permission.menus)
  permissions?: Permission[];
}
