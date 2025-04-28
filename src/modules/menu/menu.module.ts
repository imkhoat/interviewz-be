import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenuService } from './services/menu.service';
import { MenuController } from './controllers/menu.controller';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    RoleModule,
    PermissionModule,
    AuthModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
