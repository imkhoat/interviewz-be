import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from '../../user/enums/user-role.enum';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    userRole: UserRole.USER,
    refreshToken: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
    mainRoleId: null,
    mainRole: null,
    additionalRoles: [],
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    hashPassword: jest.fn().mockResolvedValue(undefined),
    validatePassword: jest.fn().mockResolvedValue(true),
    fullName: 'John Doe',
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const { password, ...userWithoutPassword } = mockUser;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual(userWithoutPassword);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockUser.validatePassword).toHaveBeenCalledWith('password');
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when password is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(mockUser, 'validatePassword').mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrong-password');

      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockUser.validatePassword).toHaveBeenCalledWith('wrong-password');
    });
  });

  describe('login', () => {
    it('should return access token and user info', async () => {
      const { password, ...userWithoutPassword } = mockUser;
      jest.spyOn(service, 'validateUser').mockResolvedValue(userWithoutPassword);

      const result = await service.login('test@example.com', 'password');

      expect(result).toEqual({
        access_token: 'test-token',
        user: userWithoutPassword,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });

  describe('signup', () => {
    const createUserDto = {
      email: 'new@example.com',
      password: 'password',
      firstName: 'New',
      lastName: 'User',
      fullName: 'New User',
    };

    it('should create a new user and return access token', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const { password, ...userWithoutPassword } = mockUser;
      const result = await service.signup(createUserDto);

      expect(result).toEqual({
        access_token: 'test-token',
        user: userWithoutPassword,
      });
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalled();
      expect(mockUser.hashPassword).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(service.signup(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh token is valid', async () => {
      const { password, ...userWithoutPassword } = mockUser;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(argon2.verify, 'mockImplementation').mockImplementation(() => Promise.resolve(true));

      const result = await service.refreshToken(1, 'valid-refresh-token');

      expect(result).toEqual({
        access_token: 'test-token',
        user: userWithoutPassword,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(argon2.verify, 'mockImplementation').mockImplementation(() => Promise.resolve(false));

      await expect(
        service.refreshToken(1, 'invalid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException when user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.refreshToken(1, 'valid-refresh-token')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      await service.logout(1);

      expect(userRepository.update).toHaveBeenCalledWith(1, {
        refreshToken: null,
      });
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto = {
      email: 'test@example.com',
    };

    it('should generate reset token and send email', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      await service.forgotPassword(forgotPasswordDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.forgotPassword(forgotPasswordDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto = {
      token: 'valid-token',
      newPassword: 'new-password',
    };

    it('should reset password successfully', async () => {
      const userWithToken = {
        ...mockUser,
        resetPasswordToken: 'valid-token',
        resetPasswordExpires: new Date(Date.now() + 3600000),
      };

      jest.spyOn(userRepository, 'find').mockResolvedValue([userWithToken]);
      jest.spyOn(argon2.verify, 'mockImplementation').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(userRepository, 'save').mockResolvedValue(userWithToken);

      await service.resetPassword(resetPasswordDto);

      expect(userRepository.find).toHaveBeenCalledWith({
        where: {
          resetPasswordToken: 'valid-token',
          resetPasswordExpires: expect.any(Object),
        },
      });
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when token is invalid', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when token is expired', async () => {
      const userWithExpiredToken = {
        ...mockUser,
        resetPasswordToken: 'valid-token',
        resetPasswordExpires: new Date(Date.now() - 3600000),
      };

      jest.spyOn(userRepository, 'find').mockResolvedValue([userWithExpiredToken]);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      password: 'current-password',
      newPassword: 'new-password',
    };

    it('should change password successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(mockUser, 'validatePassword').mockResolvedValue(true);
      jest.spyOn(mockUser, 'hashPassword').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      await service.changePassword(1, changePasswordDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockUser.validatePassword).toHaveBeenCalledWith('current-password');
      expect(mockUser.hashPassword).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.changePassword(1, changePasswordDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when current password is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(mockUser, 'validatePassword').mockResolvedValue(false);

      await expect(service.changePassword(1, changePasswordDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
}); 