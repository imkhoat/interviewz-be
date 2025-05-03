import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { UserRole } from '../enums/user-role.enum';
import * as argon2 from 'argon2';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The email of the user' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @Column()
  password: string;

  @ApiProperty({ description: 'The first name of the user' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'The last name of the user' })
  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  userRole: UserRole;

  @ApiProperty({ description: 'Whether the user is active' })
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

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'The date when the user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the user was last updated' })
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
