import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('DentalWell API')
    .setDescription('API documentation for DentalWell application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true, //Rejects requests that have extra properties
      transform: true, //Automatically converts request data into the correct type (DTO class instance)
      whitelist: true, //Removes properties that do not have decorators
    }),
  );

  await app.listen(3000);
}
bootstrap();
