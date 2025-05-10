import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '@modules/menu/entities/menu.entity';
import { User } from '@modules/user/entities/user.entity';
import { Permission } from '@modules/permission/entities/permission.entity';
import { CreateMenuDto } from '@modules/menu/dto/create-menu.dto';
import { UpdateMenuDto } from '@modules/menu/dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async findUserMenus(userId: number): Promise<Menu[]> {
    // Get user with roles and permissions
    const userWithRoles = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['mainRole', 'mainRole.permissions', 'additionalRoles', 'additionalRoles.permissions'],
    });

    if (!userWithRoles) {
      return [];
    }

    // Create a list of all permissions the user has
    const userPermissions = new Set<Permission>();

    // Add permissions from main role
    if (userWithRoles.mainRole?.permissions) {
      userWithRoles.mainRole.permissions.forEach((permission) => {
        userPermissions.add(permission);
      });
    }

    // Add permissions from additional roles
    if (userWithRoles.additionalRoles) {
      userWithRoles.additionalRoles.forEach((role) => {
        if (role.permissions) {
          role.permissions.forEach((permission) => {
            userPermissions.add(permission);
          });
        }
      });
    }

    // Get all menus that the user has access to
    const allMenus = await this.menuRepository.find({
      relations: ['permissions'],
      order: {
        order: 'ASC',
      },
    });

    // Filter menus based on access permissions
    return allMenus.filter((menu) => {
      // If menu doesn't require any permissions, allow access
      if (!menu.permissions || menu.permissions.length === 0) {
        return true;
      }

      // Check if user has at least one required permission
      return menu.permissions.some((permission) =>
        Array.from(userPermissions).some((userPerm) => userPerm.id === permission.id),
      );
    });
  }

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    await this.findOne(id); // Verify menu exists
    await this.menuRepository.update(id, updateMenuDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.menuRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Menu with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
  }
}
