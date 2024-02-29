import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { EcgsModule } from './ecgs/ecgs.module';

async function bootstrap() {
  const app = await NestFactory.create(EcgsModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3002);
}
bootstrap();
