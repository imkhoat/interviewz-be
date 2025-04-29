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
            find: jest.fn().mockResolvedValue([mockRole]),
            findOne: jest.fn().mockImplementation(() => Promise.resolve(mockRole)),
            create: jest.fn().mockReturnValue(mockRole),
            save: jest.fn().mockResolvedValue(mockRole),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            remove: jest.fn().mockResolvedValue(mockRole),
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
      const result = await service.findAll();
      expect(result).toEqual([mockRole]);
      expect(roleRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if role not found', async () => {
      jest
        .spyOn(roleRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));
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
      const result = await service.update(1, updateRoleDto);
      expect(result).toEqual(mockRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(roleRepository.update).toHaveBeenCalledWith(1, updateRoleDto);
    });

    it('should throw NotFoundException if role not found', async () => {
      const updateRoleDto = {
        name: 'Updated Role',
        description: 'Updated Description',
      };

      jest
        .spyOn(roleRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));
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

  describe('remove', () => {
    it('should remove an existing role', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockRole);
      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(roleRepository.remove).toHaveBeenCalledWith(mockRole);
    });

    it('should throw NotFoundException if role not found', async () => {
      jest
        .spyOn(roleRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(null));
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 