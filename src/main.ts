import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import corsOptions from './users/config/config-options';
import { LoggerService } from './logger/logger.service';

//global configs
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(LoggerService)); //added logger

  app.setGlobalPrefix('api'); //added prefix to url /api/users
  app.enableCors(corsOptions); //enable cors

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
