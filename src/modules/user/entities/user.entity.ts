import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as argon2 from 'argon2';
import { Role } from '@modules/role/entities/role.entity';
import { UserRole } from '@modules/user/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The email address of the user' })
  @Column({ length: 100, unique: true })
  email: string;

  @ApiProperty({ description: 'The hashed password of the user' })
  @Column({ length: 100 })
  @Exclude()
  password: string;

  @ApiProperty({ description: 'The role of the user' })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CANDIDATE,
  })
  userRole: UserRole;

  @ApiProperty({ description: 'Whether the user\'s email is verified' })
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ description: 'The email verification token' })
  @Column({ nullable: true })
  @Exclude()
  emailVerificationToken: string;

  @ApiProperty({ description: 'The expiration date of the email verification token' })
  @Column({ nullable: true })
  @Exclude()
  emailVerificationTokenExpires: Date;

  @ApiProperty({ description: 'The refresh token for authentication' })
  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @ApiProperty({ description: 'The reset password token' })
  @Column({ nullable: true })
  @Exclude()
  resetPasswordToken: string;

  @ApiProperty({ description: 'The expiration date of the reset password token' })
  @Column({ nullable: true })
  @Exclude()
  resetPasswordExpires: Date;

  @ApiProperty({ description: 'The first name of the user' })
  @Column({ length: 50, nullable: true })
  firstName?: string;

  @ApiProperty({ description: 'The last name of the user' })
  @Column({ length: 50, nullable: true })
  lastName?: string;

  @ApiProperty({ description: 'Whether the user is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'The main role ID of the user' })
  @Column({ nullable: true })
  mainRoleId?: number;

  @ApiProperty({ description: 'The main role of the user' })
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'mainRoleId' })
  mainRole?: Role;

  @ApiProperty({ description: 'The additional roles of the user' })
  @ManyToMany(() => Role, (role) => role.additionalUsers)
  @JoinTable({
    name: 'user_additional_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  additionalRoles?: Role[];

  @ApiProperty({ description: 'The last login date of the user' })
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @ApiProperty({ description: 'The creation date of the user' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The last update date of the user' })
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      try {
        this.password = await argon2.hash(this.password);
      } catch (error) {
        console.error('Error hashing password:', error);
      }
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    try {
      return await argon2.verify(this.password, password);
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  }

  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
}
