import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/app.module';
import { StarWarsModule } from 'src/starwars/starwars.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Starwars')
    .setDescription('Starwars API REST')
    .setVersion('1.0')
    .addTag('starwars')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, { include: [StarWarsModule] });

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
