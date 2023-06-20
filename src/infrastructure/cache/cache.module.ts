import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './services/redis-cache.service';
import { Redis, RedisOptions } from 'ioredis';

@Module({
  imports: [ConfigModule],
  providers: [
    RedisCacheService,
    {
      provide: Redis,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          port: configService.get('cacheServer.redisPort'),
          host: configService.get('cacheServer.redisHost'),
          username: 'default',
          password: configService.get('cacheServer.redisPassword'),
          db: 0,
          ttl: parseInt(configService.get('cacheServer.cacheTtl')),
          keyPrefix: 'customer:',
        } as RedisOptions);
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisCacheService],
})
export class CacheModule {}
