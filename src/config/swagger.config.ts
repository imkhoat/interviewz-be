import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Interviewz API')
  .setDescription('The Interviewz API documentation')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addTag('auth', 'Authentication endpoints')
  .addTag('users', 'User management endpoints')
  .addTag('roles', 'Role management endpoints')
  .addTag('permissions', 'Permission management endpoints')
  .addTag('menus', 'Menu management endpoints')
  .addTag('policies', 'Policy management endpoints')
  .addTag('resources', 'Resource management endpoints')
  .addTag('resumes', 'Resume management endpoints')
  .build(); 