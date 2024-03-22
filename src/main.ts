import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CustomExceptionFilter } from '@libs/filters/custom-exception.filter';
import { CustomValidationPipe } from '@libs/pipes/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Custom exceptions filter
  app.useGlobalFilters(new CustomExceptionFilter());

  // Cross-origin resource sharing configuration.
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Global route prefix, v1 is the version number
  app.setGlobalPrefix('api/v1');

  // Attaching the validation piper at the global level
  app.useGlobalPipes(new CustomValidationPipe());

  const port = configService.get<number>('PORT');

  await app.listen(port);
}
bootstrap();
