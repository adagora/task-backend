import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Earthquakes')
    .setDescription('Earthquakes API')
    .setVersion('1.0')
    .addTag('earthquakes')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, { include: [] });

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
