import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

export async function createTestingModule() {
  const testingModule = Test.createTestingModule({
    imports: [AppModule],
  });

  const moduleFixture = await testingModule.compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
}
