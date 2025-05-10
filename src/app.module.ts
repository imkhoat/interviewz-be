import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UserModule } from '@modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { ResumeModule } from '@modules/resume/resume.module';
import { RoleModule } from '@modules/role/role.module';
import { PermissionModule } from '@modules/permission/permission.module';
import { MenuModule } from '@modules/menu/menu.module';
import { PolicyModule } from '@modules/policy/policy.module';
import { OpenAIModule } from '@modules/openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // 👈 Load environment variables from .env first
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // 👈 Automatically load entities to avoid missing imports
      synchronize: process.env.NODE_ENV === 'development',
    }),
    UserModule,
    AuthModule,
    ResumeModule,
    RoleModule,
    PermissionModule,
    MenuModule,
    PolicyModule,
    OpenAIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
