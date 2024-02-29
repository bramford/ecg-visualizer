import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { EcgsModule } from './ecgs/ecgs.module';

async function bootstrap() {
  const app = await NestFactory.create(EcgsModule);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3002;
  app.listen(port, '::', () => {
    console.log(`Server listening on [::]${port}`);
  });
}
bootstrap();
