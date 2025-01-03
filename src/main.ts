import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import corsOptions from './users/config/config-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); //added prefix to url /api/users
  app.enableCors(corsOptions); //enable cors

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
