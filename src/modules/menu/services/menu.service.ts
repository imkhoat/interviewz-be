import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../role/entities/role.entity';
import { Permission } from '../../permission/entities/permission.entity';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.find({
      relations: ['roles', 'permissions'],
    });
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['roles', 'permissions'],
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return menu;
  }

  async findUserMenus(userId: number): Promise<Menu[]> {
    // Lấy user với role và permissions
    const user = await this.menuRepository.manager.findOne(User, {
      where: { id: userId },
      relations: [
        'mainRole',
        'mainRole.permissions',
        'additionalRoles',
        'additionalRoles.permissions',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Tạo danh sách tất cả permissions mà user có
    const userPermissions = new Set<number>();

    // Thêm permissions từ role chính
    if (user.mainRole && user.mainRole.permissions) {
      user.mainRole.permissions.forEach((permission) => {
        userPermissions.add(permission.id);
      });
    }

    // Thêm permissions từ các role bổ sung
    if (user.additionalRoles) {
      user.additionalRoles.forEach((role) => {
        if (role.permissions) {
          role.permissions.forEach((permission) => {
            userPermissions.add(permission.id);
          });
        }
      });
    }

    // Lấy tất cả menu mà user có quyền truy cập
    const menus = await this.menuRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.permissions', 'permission')
      .leftJoinAndSelect('menu.roles', 'role')
      .where(
        '(permission.id IN (:...permissionIds) OR role.id IN (:...roleIds))',
        {
          permissionIds: Array.from(userPermissions),
          roleIds: [
            user.mainRole?.id,
            ...(user.additionalRoles?.map((r) => r.id) || []),
          ].filter(Boolean),
        },
      )
      .orderBy('menu.order', 'ASC')
      .getMany();

    // Lọc menu dựa trên quyền truy cập
    return this.filterMenusByPermissions(menus, userPermissions);
  }

  private filterMenusByPermissions(
    menus: Menu[],
    userPermissions: Set<number>,
  ): Menu[] {
    return menus.filter((menu) => {
      // Nếu menu không yêu cầu permission nào, cho phép truy cập
      if (!menu.permissions || menu.permissions.length === 0) {
        return true;
      }

      // Kiểm tra xem user có ít nhất một permission cần thiết không
      return menu.permissions.some((permission) =>
        userPermissions.has(permission.id),
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
