/* eslint-disable @typescript-eslint/no-explicit-any */
import cookie, { FastifyCookieOptions } from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { AppModule } from './app/app.module';
import { AuthModule } from '@org/nest/auth';
import { CommunicationModule } from '@org/nest/communication';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FunctionModule } from '@org/nest/function';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ResourceModule } from '@org/nest/resource';
import { StorageModule } from '@org/nest/storage';

const serviceModules = {
  all: AppModule,
  auth: AuthModule.withControllers(),
  resource: ResourceModule.withControllers(),
  communication: CommunicationModule.withControllers(),
  function: FunctionModule.withControllers(),
  storage: StorageModule.withControllers(),
};

async function bootstrap() {
  const argWithServiceDef =
    process.argv
      .find((value) => value.includes('--service='))
      ?.split('=')
      ?.at(-1) ?? 'all';

  const app = await NestFactory.create<NestFastifyApplication>(
    serviceModules[argWithServiceDef] ?? AppModule,
    new FastifyAdapter({})
  );
  const port = process.env['PORT'] || process.env['BACKEND_PORT'] || 3000;

  const allowedOrigins = process.env['ALLOWED_ORIGINS']?.split(',') ?? [];

  app.enableCors({
    origin: allowedOrigins,
    allowedHeaders: ['Content-Type'],
    credentials: true,
  });
  await app.register(
    cookie as any,
    {
      secret: process.env['COOKIE_SECRET'], // for cookies signature
    } as FastifyCookieOptions
  );
  await app.register(helmet as any);
  await app.register(fastifyCsrf as any);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
