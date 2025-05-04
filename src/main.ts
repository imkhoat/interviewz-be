import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Setup Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
