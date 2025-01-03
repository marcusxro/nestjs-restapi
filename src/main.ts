import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import corsOptions from './users/config/config-options';
import { LoggerService } from './logger/logger.service';
import { HttpExceptionFilter } from './http-exception.filter';


//global configs
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(LoggerService); // Retrieve your custom logger instance

  app.useGlobalFilters(new HttpExceptionFilter(logger)); //added global filter


  app.useLogger(app.get(LoggerService)); //added logger

  app.setGlobalPrefix('api'); //added prefix to url /api/users
  app.enableCors(corsOptions); //enable cors

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
