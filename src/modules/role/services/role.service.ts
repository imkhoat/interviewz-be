import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Permission } from '../../permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { permissionIds = [], ...roleData } = createRoleDto;
    const permissions =
      await this.permissionRepository.findByIds(permissionIds);

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    const role = this.roleRepository.create({
      ...roleData,
      permissions,
    });

    return this.roleRepository.save(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { permissionIds, ...roleData } = updateRoleDto;
    const role = await this.findOne(id);

    if (permissionIds && permissionIds.length > 0) {
      const permissions =
        await this.permissionRepository.findByIds(permissionIds);
      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('One or more permissions not found');
      }
      role.permissions = permissions;
    }

    Object.assign(role, roleData);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<Role> {
    const role = await this.findOne(id);
    return this.roleRepository.remove(role);
  }
}
