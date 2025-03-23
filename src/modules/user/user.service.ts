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
    return this.userRepository.findByEmail(email);
  }

  async createUser(payload: CreateUserDto): Promise<UserResponseDto> {
    console.log('createUser', payload);
    const user = this.userRepository.create(payload);
    await this.userRepository.save(user);

    const { password, refreshToken, ...userResponse } = user;
    return userResponse;
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
}
