import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Resume } from '../../resume/entities/resume.entity';
import { Role as RoleEntity } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { Role } from '../enums/role.enum';
import { UserRole } from '../enums/user-role.enum';
import * as argon2 from 'argon2';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes: Resume[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  userRole: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ nullable: true })
  mainRoleId: number;

  @ManyToOne(() => RoleEntity, { nullable: true })
  mainRole: RoleEntity;

  @ManyToMany(() => RoleEntity)
  @JoinTable()
  additionalRoles: RoleEntity[];

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  async hashPassword(): Promise<void> {
    this.password = await argon2.hash(this.password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }
} 