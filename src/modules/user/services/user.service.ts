import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { UserResponseDto } from '@modules/user/dto/user-response.dto';
import { UpdateUserDto } from '@modules/user/dto/update-user.dto';
import { UserRole } from '@modules/user/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password ?? '', 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      userRole: UserRole.CANDIDATE, // Default role for new users
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByProviderId(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    const field = `${provider.toLowerCase()}Id`;
    return this.userRepository.findOne({ where: { [field]: providerId } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  async createUser(payload: CreateUserDto): Promise<UserResponseDto> {
    const user = this.userRepository.create(payload);
    await this.userRepository.save(user);

    const {
      password,
      refreshToken,
      resetPasswordToken,
      resetPasswordExpires,
      mainRoleId,
      ...userResponse
    } = user;
    return {
      ...userResponse,
      fullName: user.fullName,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    await this.userRepository.update(userId, {
      refreshToken: refreshToken ?? undefined,
    });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return argon2.verify(user.password, password);
  }
}
