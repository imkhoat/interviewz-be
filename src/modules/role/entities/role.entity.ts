import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../user/user.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { Menu } from '../../menu/entities/menu.entity';
import { Policy } from '../../policy/entities/policy.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  permissions?: Permission[];

  @ManyToMany(() => Menu, (menu) => menu.roles)
  menus?: Menu[];

  @ManyToMany(() => Policy, (policy) => policy.roles)
  policies?: Policy[];

  @OneToMany(() => User, (user) => user.mainRole)
  users?: User[];

  @OneToMany(() => User, (user) => user.additionalRoles)
  additionalUsers?: User[];
} 