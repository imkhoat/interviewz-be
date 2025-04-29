import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from '../services/permission.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

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
  } as Permission;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
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
      jest.spyOn(permissionRepository, 'find').mockResolvedValue([mockPermission]);

      const result = await service.findAll();

      expect(result).toEqual([mockPermission]);
      expect(permissionRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a permission by id', async () => {
      jest
        .spyOn(permissionRepository, 'findOne')
        .mockResolvedValue(mockPermission);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPermission);
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['roles', 'menus'],
      });
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['roles', 'menus'],
      });
    });
  });

  describe('create', () => {
    const createPermissionDto = {
      name: 'view:dashboard',
      code: 'VIEW_DASHBOARD',
      description: 'View dashboard permission',
    };

    it('should create a new permission', async () => {
      jest
        .spyOn(permissionRepository, 'create')
        .mockReturnValue(mockPermission);
      jest.spyOn(permissionRepository, 'save').mockResolvedValue(mockPermission);

      const result = await service.create(createPermissionDto);

      expect(result).toEqual(mockPermission);
      expect(permissionRepository.create).toHaveBeenCalledWith(createPermissionDto);
      expect(permissionRepository.save).toHaveBeenCalledWith(mockPermission);
    });
  });

  describe('update', () => {
    const updatePermissionDto = {
      name: 'updated:permission',
      code: 'UPDATED_PERMISSION',
      description: 'Updated permission description',
    };

    it('should update an existing permission', async () => {
      const updatedPermission = {
        ...mockPermission,
        ...updatePermissionDto,
      };
      jest
        .spyOn(permissionRepository, 'findOne')
        .mockResolvedValue(mockPermission);
      jest.spyOn(permissionRepository, 'save').mockResolvedValue(updatedPermission);

      const result = await service.update(1, updatePermissionDto);

      expect(result).toEqual(updatedPermission);
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['roles', 'menus'],
      });
      expect(permissionRepository.save).toHaveBeenCalledWith({
        ...mockPermission,
        ...updatePermissionDto,
      });
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, updatePermissionDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['roles', 'menus'],
      });
    });
  });

  describe('delete', () => {
    it('should delete an existing permission', async () => {
      jest
        .spyOn(permissionRepository, 'findOne')
        .mockResolvedValue(mockPermission);
      jest
        .spyOn(permissionRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await service.delete(1);

      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['roles', 'menus'],
      });
      expect(permissionRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['roles', 'menus'],
      });
    });
  });
}); 