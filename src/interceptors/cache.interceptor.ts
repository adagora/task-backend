import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RedisCache } from 'cache-manager-redis-yet';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class GraphQLCacheInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();
    const args = ctx.getArgs();

    // Generate cache key based on operation name and arguments
    const cacheKey = this.generateCacheKey(info.fieldName, args);

    // Try to get data from cache
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      console.log('Cache hit for key:', cacheKey);
      return of(cachedData);
    }

    // If not in cache, execute handler and cache result
    return next.handle().pipe(
      switchMap(async (data) => {
        await this.cacheManager.set(
          cacheKey,
          data,
          parseInt(process.env.CACHE_DEFAULT_TTL!),
        );
        return data;
      }),
    );
  }

  private generateCacheKey(
    fieldName: string,
    args: Record<string, unknown>,
  ): string {
    const argsString = args ? JSON.stringify(args) : '';
    return `${fieldName}_${argsString}`;
  }
}
