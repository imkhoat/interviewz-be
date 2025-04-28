import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
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

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    await this.userRepository.update(userId, {
      refreshToken: refreshToken ?? undefined,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }
}
