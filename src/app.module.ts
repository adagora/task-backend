import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Inject, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/database/database.module';
import { StarWarsModule } from './starwars/starwars.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';

import { RedisCache, redisStore } from 'cache-manager-redis-yet';
import { GraphQLCacheInterceptor } from './interceptors/cache.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'production'}`, '.env'],
    }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    StarWarsModule,
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          store: redisStore,
          database: process.env.REDIS_DEFAULT_DB,
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT!),
            password: process.env.REDIS_PASSWORD,
            ttl: parseInt(process.env.CACHE_DEFAULT_TTL!),
          },
        };
      },
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GraphQLCacheInterceptor,
    },
  ],
})
export class AppModule {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {}

  async onModuleDestroy() {
    await this.cacheManager.store.client.quit();
  }
}
