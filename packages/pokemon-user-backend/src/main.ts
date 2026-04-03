/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { startDatabase } from './modules/database/db';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  process.on('uncaughtException', (error) => {
    console.error(error);
    process.exit();
  });

  await startDatabase();

  const app = await NestFactory.create(AppModule);

  /** Enable CORS for the specified origin and HTTP/S methods */
  app.enableCors({
    origin: [process.env.CORS_ORIGIN || 'http://localhost:4200'],
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  /** Enable global validation pipe
   * @param forbidNonWhitelisted: Rejects requests with properties that are not defined,
   * enhancing security by preventing unexpected data from being processed; good for 
   * catching typos and ensuring that only intended data is accepted. It can be 
   * inconvenient during development when the DTOs are still evolving and DTO classes
   * are updated to match the incoming request shapes. For production, it's
   * recommended to enable this option for better security and data integrity.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = 3000;
  // const port = process.env.PORT || 3000;

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
