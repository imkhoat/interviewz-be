import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@modules/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from '@modules/user/enums/user-role.enum';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

type MockUserMethods = {
  hashPassword: jest.Mock;
  validatePassword: jest.Mock;
};

type MockUserData = Omit<User, 'hashPassword' | 'validatePassword'> & {
  refreshToken: string | undefined;
  resetPasswordToken: string | undefined;
  resetPasswordExpires: Date | undefined;
  mainRoleId: number | undefined;
  mainRole: undefined;
  additionalRoles: [];
  permissions: [];
  lastLoginAt: Date | undefined;
};

type MockUser = MockUserData & MockUserMethods;

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser: MockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    userRole: UserRole.USER,
    isActive: true,
    refreshToken: undefined,
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined,
    mainRoleId: undefined,
    mainRole: undefined,
    additionalRoles: [],
    permissions: [],
    lastLoginAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
    fullName: 'John Doe',
  };

  const mockUserWithoutPassword = {
    id: mockUser.id,
    email: mockUser.email,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    fullName: mockUser.fullName,
    userRole: mockUser.userRole,
    isActive: mockUser.isActive,
    mainRoleId: mockUser.mainRoleId,
    mainRole: mockUser.mainRole,
    additionalRoles: mockUser.additionalRoles,
    permissions: mockUser.permissions,
    lastLoginAt: mockUser.lastLoginAt,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(mockUser as unknown as User),
              ),
            find: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve([mockUser as unknown as User]),
              ),
            create: jest.fn().mockReturnValue(mockUser as unknown as User),
            save: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(mockUser as unknown as User),
              ),
            update: jest
              .fn()
              .mockImplementation(() => Promise.resolve({ affected: 1 })),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
            verify: jest.fn().mockReturnValue({ sub: 1 }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('secret'),
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
    it('should return user without password if validation succeeds', async () => {
      (argon2.verify as jest.Mock).mockImplementation(() =>
        Promise.resolve(true),
      );

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should return null if user not found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      (argon2.verify as jest.Mock).mockImplementation(() =>
        Promise.resolve(false),
      );

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const signupDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
      };

      (argon2.hash as jest.Mock).mockImplementation(() =>
        Promise.resolve('hashedPassword'),
      );

      const result = await service.signup(signupDto);
      expect(result).toEqual(mockUserWithoutPassword);
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      const signupDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
      };

      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(mockUser as unknown as User));

      await expect(service.signup(signupDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      (argon2.verify as jest.Mock).mockImplementation(() =>
        Promise.resolve(true),
      );

      const result = await service.login('test@example.com', 'password');
      expect(result).toEqual({
        accessToken: 'token',
        user: mockUserWithoutPassword,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));

      await expect(
        service.login('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      (argon2.verify as jest.Mock).mockImplementation(() =>
        Promise.resolve(false),
      );

      await expect(
        service.login('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('resetPassword', () => {
    const mockUserWithToken = {
      ...mockUser,
      resetPasswordToken: 'validToken',
      resetPasswordExpires: new Date(Date.now() + 3600000),
    } as User;

    it('should reset password with valid token', async () => {
      jest
        .spyOn(userRepository, 'find')
        .mockImplementation(() => Promise.resolve([mockUserWithToken]));

      (argon2.verify as jest.Mock).mockImplementation(() =>
        Promise.resolve(true),
      );
      (argon2.hash as jest.Mock).mockImplementation(() =>
        Promise.resolve('newHashedPassword'),
      );

      const result = await service.resetPassword({
        token: 'validToken',
        newPassword: 'newPassword',
      });
      expect(result).toBeTruthy();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if token not found', async () => {
      jest
        .spyOn(userRepository, 'find')
        .mockImplementation(() => Promise.resolve([]));

      await expect(
        service.resetPassword({
          token: 'invalidToken',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if token is expired', async () => {
      const mockUserWithExpiredToken = {
        ...mockUser,
        resetPasswordToken: 'expiredToken',
        resetPasswordExpires: new Date(Date.now() - 3600000),
      } as User;

      jest
        .spyOn(userRepository, 'find')
        .mockImplementation(() => Promise.resolve([mockUserWithExpiredToken]));

      await expect(
        service.resetPassword({
          token: 'expiredToken',
          newPassword: 'newPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh token is valid', async () => {
      const result = await service.refreshToken(1, 'valid-refresh-token');

      expect(result).toEqual({
        accessToken: 'token',
        user: mockUserWithoutPassword,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));

      await expect(
        service.refreshToken(1, 'valid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      (argon2.verify as jest.Mock).mockImplementation(() =>
        Promise.resolve(false),
      );

      await expect(
        service.refreshToken(1, 'invalid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
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
      expect(mockUser.validatePassword).toHaveBeenCalledWith(
        'current-password',
      );
      expect(mockUser.hashPassword).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.changePassword(1, changePasswordDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when current password is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(mockUser, 'validatePassword').mockResolvedValue(false);

      await expect(
        service.changePassword(1, changePasswordDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
