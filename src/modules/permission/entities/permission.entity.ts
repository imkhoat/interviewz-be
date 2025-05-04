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
import { Menu } from '@modules/menu/entities/menu.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('permissions')
export class Permission {
  @ApiProperty({ description: 'The unique identifier of the permission' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the permission' })
  @Column({ length: 50, unique: true })
  name: string;

  @ApiProperty({ description: 'The description of the permission' })
  @Column({ length: 255, nullable: true })
  description?: string;

  @ApiProperty({ description: 'The date when the permission was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the permission was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 50, unique: true })
  code: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[];

  @ManyToMany(() => Menu, (menu) => menu.permissions)
  menus?: Menu[];
}
