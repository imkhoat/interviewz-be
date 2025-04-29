import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { UserRole } from '../enums/user-role.enum';
import * as argon2 from 'argon2';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

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

  @ManyToOne(() => Role, { nullable: true })
  mainRole: Role;

  @ManyToMany(() => Role)
  @JoinTable()
  additionalRoles: Role[];

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