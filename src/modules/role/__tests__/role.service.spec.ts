import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from '../services/role.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';
import { NotFoundException } from '@nestjs/common';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: Repository<Role>;
  let permissionRepository: Repository<Permission>;

  const mockRole = {
    id: 1,
    name: 'Admin',
    description: 'Administrator role',
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Role;

  const mockPermission = {
    id: 1,
    name: 'view:dashboard',
    description: 'View dashboard permission',
  } as Permission;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
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
          provide: getRepositoryToken(Permission),
          useValue: {
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    permissionRepository = module.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      jest.spyOn(roleRepository, 'find').mockResolvedValue([mockRole]);

      const result = await service.findAll();

      expect(result).toEqual([mockRole]);
      expect(roleRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole);

      const result = await service.findOne(1);

      expect(result).toEqual(mockRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['permissions'],
      });
    });

    it('should throw NotFoundException if role not found', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createRoleDto = {
      name: 'New Role',
      description: 'New role description',
      permissionIds: [1],
    };

    it('should create a new role', async () => {
      jest
        .spyOn(permissionRepository, 'findByIds')
        .mockResolvedValue([mockPermission]);
      jest.spyOn(roleRepository, 'create').mockReturnValue(mockRole);
      jest.spyOn(roleRepository, 'save').mockResolvedValue(mockRole);

      const result = await service.create(createRoleDto);

      expect(result).toEqual(mockRole);
      expect(roleRepository.create).toHaveBeenCalledWith({
        ...createRoleDto,
        permissions: [mockPermission],
      });
      expect(roleRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest.spyOn(permissionRepository, 'findByIds').mockResolvedValue([]);

      await expect(service.create(createRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateRoleDto = {
      name: 'Updated Role',
      description: 'Updated role description',
      permissionIds: [1],
    };

    it('should update an existing role', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole);
      jest
        .spyOn(permissionRepository, 'findByIds')
        .mockResolvedValue([mockPermission]);
      jest.spyOn(roleRepository, 'save').mockResolvedValue({
        ...mockRole,
        ...updateRoleDto,
      });

      const result = await service.update(1, updateRoleDto);

      expect(result).toEqual({
        ...mockRole,
        ...updateRoleDto,
      });
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['permissions'],
      });
      expect(roleRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if role not found', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, updateRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if permission not found', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole);
      jest.spyOn(permissionRepository, 'findByIds').mockResolvedValue([]);

      await expect(service.update(1, updateRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing role', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole);
      jest.spyOn(roleRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.delete(1);

      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(roleRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if role not found', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 