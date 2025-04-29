import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from '../services/menu.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Menu } from '../entities/menu.entity';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';

describe('MenuService', () => {
  let service: MenuService;
  let menuRepository: Repository<Menu>;
  let roleRepository: Repository<Role>;
  let permissionRepository: Repository<Permission>;

  const mockMenu = {
    id: 1,
    name: 'Test Menu',
    path: '/test',
    icon: 'test-icon',
    order: 1,
    parentId: undefined,
    roles: [],
    permissions: [],
  };

  const mockRole = {
    id: 1,
    name: 'Test Role',
    description: 'Test Description',
    menus: [],
    permissions: [],
  };

  const mockPermission = {
    id: 1,
    name: 'Test Permission',
    description: 'Test Description',
    menus: [],
    roles: [],
  };

  const mockUser = {
    id: 1,
    mainRole: mockRole,
    roles: [mockRole],
    permissions: [mockPermission],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Menu),
          useValue: {
            find: jest.fn().mockResolvedValue([mockMenu]),
            findOne: jest.fn().mockResolvedValue(mockMenu),
            create: jest.fn().mockReturnValue(mockMenu),
            save: jest.fn().mockResolvedValue(mockMenu),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            remove: jest.fn().mockResolvedValue(mockMenu),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            find: jest.fn().mockResolvedValue([mockRole]),
            findOne: jest.fn().mockResolvedValue(mockRole),
            create: jest.fn().mockReturnValue(mockRole),
            save: jest.fn().mockResolvedValue(mockRole),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            remove: jest.fn().mockResolvedValue(mockRole),
          },
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            find: jest.fn().mockResolvedValue([mockPermission]),
            findOne: jest.fn().mockResolvedValue(mockPermission),
            create: jest.fn().mockReturnValue(mockPermission),
            save: jest.fn().mockResolvedValue(mockPermission),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            remove: jest.fn().mockResolvedValue(mockPermission),
          },
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    menuRepository = module.get<Repository<Menu>>(getRepositoryToken(Menu));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    permissionRepository = module.get<Repository<Permission>>(getRepositoryToken(Permission));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of menus', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockMenu]);
      expect(menuRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a menu', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockMenu);
      expect(menuRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if menu not found', async () => {
      jest.spyOn(menuRepository, 'findOne').mockImplementation(() => Promise.resolve(null));
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a menu', async () => {
      const createMenuDto = {
        name: 'Test Menu',
        path: '/test',
        icon: 'test-icon',
        order: 1,
        parentId: undefined,
        roleIds: [1],
        permissionIds: [1],
      };

      const result = await service.create(createMenuDto);
      expect(result).toEqual(mockMenu);
      expect(menuRepository.create).toHaveBeenCalledWith(createMenuDto);
      expect(menuRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if role not found', async () => {
      const createMenuDto = {
        name: 'Test Menu',
        path: '/test',
        icon: 'test-icon',
        order: 1,
        parentId: undefined,
        roleIds: [1],
        permissionIds: [1],
      };

      jest.spyOn(roleRepository, 'findOne').mockImplementation(() => Promise.resolve(null));
      await expect(service.create(createMenuDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if permission not found', async () => {
      const createMenuDto = {
        name: 'Test Menu',
        path: '/test',
        icon: 'test-icon',
        order: 1,
        parentId: undefined,
        roleIds: [1],
        permissionIds: [1],
      };

      jest.spyOn(permissionRepository, 'findOne').mockImplementation(() => Promise.resolve(null));
      await expect(service.create(createMenuDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a menu', async () => {
      const updateMenuDto = {
        name: 'Updated Menu',
        path: '/updated',
        icon: 'updated-icon',
        order: 2,
        parentId: undefined,
        roleIds: [1],
        permissionIds: [1],
      };

      const result = await service.update(1, updateMenuDto);
      expect(result).toEqual(mockMenu);
      expect(menuRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(menuRepository.update).toHaveBeenCalledWith(1, updateMenuDto);
    });

    it('should throw NotFoundException if menu not found', async () => {
      const updateMenuDto = {
        name: 'Updated Menu',
        path: '/updated',
        icon: 'updated-icon',
        order: 2,
        parentId: undefined,
        roleIds: [1],
        permissionIds: [1],
      };

      jest.spyOn(menuRepository, 'findOne').mockImplementation(() => Promise.resolve(null));
      await expect(service.update(1, updateMenuDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a menu', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockMenu);
      expect(menuRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(menuRepository.remove).toHaveBeenCalledWith(mockMenu);
    });

    it('should throw NotFoundException if menu not found', async () => {
      jest.spyOn(menuRepository, 'findOne').mockImplementation(() => Promise.resolve(null));
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserMenus', () => {
    it('should return menus for user with roles and permissions', async () => {
      const result = await service.findUserMenus(1);
      expect(result).toEqual([mockMenu]);
      expect(menuRepository.manager.findOne).toHaveBeenCalledWith(User, {
        where: { id: 1 },
        relations: ['mainRole', 'roles', 'permissions'],
      });
    });

    it('should return empty array if user has no roles or permissions', async () => {
      menuRepository.manager.findOne.mockResolvedValueOnce({
        ...mockUser,
        roles: [],
        permissions: [],
      });
      const result = await service.findUserMenus(1);
      expect(result).toEqual([]);
    });
  });
}); 