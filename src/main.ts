import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'Campaign Scheduler')
    .setDescription(process.env.SWAGGER_DESCRIPTION || 'The campaign scheduler API')
    .setVersion(process.env.SWAGGER_VERSION || '1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
