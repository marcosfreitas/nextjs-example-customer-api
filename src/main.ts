import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './infrastructure/configuration/contracts/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.get<AppConfig>('application.listenPort', {
    infer: true,
  });

  await app.listen(port);
}

bootstrap();
