import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { runSeed } from './seed/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const dataSource = app.get(DataSource);
  await runSeed(dataSource);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
