import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  // Initialize Passport
  app.use(passport.initialize());

  app.enableCors();

  const configService = app.get(ConfigService);

  // Serve static files from the 'public' directory
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  // Swagger Configuration
  const options = new DocumentBuilder()
    .setTitle('Mafia Platform APIs')
    .setDescription(
      'This page is for frontend developers to connect to the API and view the API list',
    )
    .setVersion('1.0')
    .addBearerAuth() // Add Bearer authorization
    .build();

  const document = SwaggerModule.createDocument(app, options);

  // Add Bearer token to Swagger
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      authAction: {
        BearerAuth: {
          name: 'BearerAuth',
          schema: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.listen(configService.get('port') || 3000);
}
bootstrap();
