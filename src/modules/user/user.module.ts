import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { UserController } from '@modules/user/controllers/user.controller';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
