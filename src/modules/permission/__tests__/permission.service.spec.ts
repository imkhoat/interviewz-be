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
    description: 'View dashboard permission',
    code: 'VIEW_DASHBOARD',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    it('should return all permissions', async () => {
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
      });
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createPermissionDto = {
      name: 'new:permission',
      description: 'New permission description',
      code: 'NEW_PERMISSION',
    };

    it('should create a new permission', async () => {
      jest
        .spyOn(permissionRepository, 'create')
        .mockReturnValue(mockPermission);
      jest.spyOn(permissionRepository, 'save').mockResolvedValue(mockPermission);

      const result = await service.create(createPermissionDto);

      expect(result).toEqual(mockPermission);
      expect(permissionRepository.create).toHaveBeenCalledWith(createPermissionDto);
      expect(permissionRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updatePermissionDto = {
      name: 'updated:permission',
      description: 'Updated permission description',
      code: 'UPDATED_PERMISSION',
    };

    it('should update an existing permission', async () => {
      jest
        .spyOn(permissionRepository, 'findOne')
        .mockResolvedValue(mockPermission);
      jest.spyOn(permissionRepository, 'save').mockResolvedValue({
        ...mockPermission,
        ...updatePermissionDto,
      });

      const result = await service.update(1, updatePermissionDto);

      expect(result).toEqual({
        ...mockPermission,
        ...updatePermissionDto,
      });
      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(permissionRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, updatePermissionDto)).rejects.toThrow(
        NotFoundException,
      );
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
      });
      expect(permissionRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 