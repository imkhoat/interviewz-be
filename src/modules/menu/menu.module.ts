import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '@modules/menu/entities/menu.entity';
import { MenuService } from '@modules/menu/services/menu.service';
import { MenuController } from '@modules/menu/controllers/menu.controller';
import { RoleModule } from '@modules/role/role.module';
import { PermissionModule } from '@modules/permission/permission.module';
import { AuthModule } from '@modules/auth/auth.module';
import { Role } from '@modules/role/entities/role.entity';
import { Permission } from '@modules/permission/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, Role, Permission]),
    RoleModule,
    PermissionModule,
    AuthModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
