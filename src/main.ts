import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const APP_PORT = 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(APP_PORT);
}
bootstrap();
