import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from '../services/permission.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('PermissionService', () => {
  let service: PermissionService;
  let permissionRepository: Repository<Permission>;

  const mockPermission = {
    id: 1,
    name: 'view:dashboard',
    code: 'VIEW_DASHBOARD',
    description: 'View dashboard permission',
    roles: [],
    menus: [],
    createdAt: new Date('2025-04-28T16:47:11.428Z'),
    updatedAt: new Date('2025-04-28T16:47:11.428Z'),
  };

  const updatedPermission = {
    id: 1,
    name: 'updated:permission',
    code: 'UPDATED_PERMISSION',
    description: 'Updated permission description',
    roles: [],
    menus: [],
    createdAt: new Date('2025-04-28T16:47:11.428Z'),
    updatedAt: new Date('2025-04-28T16:47:11.428Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            find: jest.fn().mockResolvedValue([mockPermission]),
            findOne: jest
              .fn()
              .mockImplementation(() => Promise.resolve(mockPermission)),
            create: jest.fn().mockReturnValue(mockPermission),
            save: jest.fn().mockResolvedValue(mockPermission),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            remove: jest.fn().mockResolvedValue(mockPermission),
          },
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    permissionRepository = module.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of permissions', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockPermission]);
      expect(permissionRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a permission by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockPermission);
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest
        .spyOn(permissionRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('create', () => {
    it('should create a permission', async () => {
      const createPermissionDto = {
        name: 'view:dashboard',
        code: 'VIEW_DASHBOARD',
        description: 'View dashboard permission',
      };

      const result = await service.create(createPermissionDto);
      expect(result).toEqual(mockPermission);
      expect(permissionRepository.create).toHaveBeenCalledWith(
        createPermissionDto,
      );
      expect(permissionRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a permission', async () => {
      const updatePermissionDto = {
        name: 'updated:permission',
        code: 'UPDATED_PERMISSION',
        description: 'Updated permission description',
      };

      jest
        .spyOn(permissionRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(mockPermission));
      jest
        .spyOn(permissionRepository, 'save')
        .mockImplementation(() => Promise.resolve(updatedPermission));

      const result = await service.update(1, updatePermissionDto);
      expect(result).toEqual(updatedPermission);
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(permissionRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if permission not found', async () => {
      const updatePermissionDto = {
        name: 'updated:permission',
        code: 'UPDATED_PERMISSION',
        description: 'Updated permission description',
      };

      jest
        .spyOn(permissionRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));

      await expect(service.update(1, updatePermissionDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('remove', () => {
    it('should remove a permission', async () => {
      jest
        .spyOn(permissionRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(mockPermission));

      const result = await service.remove(1);
      expect(result).toEqual(mockPermission);
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(permissionRepository.remove).toHaveBeenCalledWith(mockPermission);
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest
        .spyOn(permissionRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
