import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { MenuService } from '../services/menu.service';
import { Menu } from '../entities/menu.entity';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { User, UserRole } from '../../user/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('MenuService', () => {
  let service: MenuService;
  let menuRepository: Repository<Menu>;
  let roleRepository: Repository<Role>;
  let permissionRepository: Repository<Permission>;

  const mockUser = {
    id: 1,
    email: 'john@example.com',
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
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
    fullName: 'John Doe',
  } as unknown as User;

  const mockRole = {
    id: 1,
    name: 'Admin',
    description: 'Administrator role',
    permissions: [],
  } as Role;

  const mockPermission = {
    id: 1,
    name: 'view:dashboard',
    description: 'View dashboard permission',
    code: 'VIEW_DASHBOARD',
  } as Permission;

  const mockMenu = {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
    order: 1,
    roles: [],
    permissions: [],
  } as Menu;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Menu),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findByIds: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    menuRepository = module.get<Repository<Menu>>(getRepositoryToken(Menu));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    permissionRepository = module.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all menus', async () => {
      const findSpy = jest.spyOn(menuRepository, 'find');
      findSpy.mockResolvedValue([mockMenu]);

      const result = await service.findAll();

      expect(result).toEqual([mockMenu]);
      expect(findSpy).toHaveBeenCalled();
    });
  });

  describe('findUserMenus', () => {
    it('should return menus for user with roles and permissions', async () => {
      const userWithRoles = {
        ...mockUser,
        roles: [mockRole],
        permissions: [mockPermission],
      };

      const findSpy = jest.spyOn(menuRepository, 'find');
      findSpy.mockResolvedValue([mockMenu]);

      const result = await service.findUserMenus(userWithRoles.id);

      expect(result).toEqual([mockMenu]);
      expect(findSpy).toHaveBeenCalled();
    });

    it('should return empty array if user has no roles or permissions', async () => {
      const findSpy = jest.spyOn(menuRepository, 'find');
      findSpy.mockResolvedValue([]);

      const result = await service.findUserMenus(mockUser.id);

      expect(result).toEqual([]);
      expect(findSpy).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const createMenuDto = {
      name: 'New Menu',
      path: '/new-menu',
      icon: 'new-icon',
      order: 2,
      parentId: undefined,
      roleIds: [1],
      permissionIds: [1],
    };

    it('should create a new menu', async () => {
      const findByIdsSpy = jest.spyOn(roleRepository, 'findByIds');
      findByIdsSpy.mockResolvedValue([mockRole]);

      const findByIdsPermSpy = jest.spyOn(permissionRepository, 'findByIds');
      findByIdsPermSpy.mockResolvedValue([mockPermission]);

      const createSpy = jest.spyOn(menuRepository, 'create');
      createSpy.mockReturnValue(mockMenu);

      const saveSpy = jest.spyOn(menuRepository, 'save');
      saveSpy.mockResolvedValue(mockMenu);

      const result = await service.create(createMenuDto);

      expect(result).toEqual(mockMenu);
      expect(createSpy).toHaveBeenCalledWith({
        ...createMenuDto,
        roles: [mockRole],
        permissions: [mockPermission],
      });
      expect(saveSpy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if role not found', async () => {
      const findByIdsSpy = jest.spyOn(roleRepository, 'findByIds');
      findByIdsSpy.mockResolvedValue([]);

      await expect(service.create(createMenuDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if permission not found', async () => {
      const findByIdsSpy = jest.spyOn(roleRepository, 'findByIds');
      findByIdsSpy.mockResolvedValue([mockRole]);

      const findByIdsPermSpy = jest.spyOn(permissionRepository, 'findByIds');
      findByIdsPermSpy.mockResolvedValue([]);

      await expect(service.create(createMenuDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateMenuDto = {
      name: 'Updated Menu',
      path: '/updated-menu',
      icon: 'updated-icon',
      order: 3,
      parentId: undefined,
      roleIds: [1],
      permissionIds: [1],
    };

    it('should update an existing menu', async () => {
      const findOneSpy = jest.spyOn(menuRepository, 'findOne');
      findOneSpy.mockResolvedValue(mockMenu);

      const findByIdsSpy = jest.spyOn(roleRepository, 'findByIds');
      findByIdsSpy.mockResolvedValue([mockRole]);

      const findByIdsPermSpy = jest.spyOn(permissionRepository, 'findByIds');
      findByIdsPermSpy.mockResolvedValue([mockPermission]);

      const saveSpy = jest.spyOn(menuRepository, 'save');
      saveSpy.mockResolvedValue({
        ...mockMenu,
        ...updateMenuDto,
      } as Menu);

      const result = await service.update(1, updateMenuDto);

      expect(result).toEqual({
        ...mockMenu,
        ...updateMenuDto,
      });
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['roles', 'permissions'],
      });
      expect(saveSpy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if menu not found', async () => {
      const findOneSpy = jest.spyOn(menuRepository, 'findOne');
      findOneSpy.mockResolvedValue(null);

      await expect(service.update(1, updateMenuDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing menu', async () => {
      const findOneSpy = jest.spyOn(menuRepository, 'findOne');
      findOneSpy.mockResolvedValue(mockMenu);

      const deleteSpy = jest.spyOn(menuRepository, 'delete');
      deleteSpy.mockResolvedValue({
        affected: 1,
        raw: {},
      } as DeleteResult);

      await service.remove(1);

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(deleteSpy).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if menu not found', async () => {
      const findOneSpy = jest.spyOn(menuRepository, 'findOne');
      findOneSpy.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 