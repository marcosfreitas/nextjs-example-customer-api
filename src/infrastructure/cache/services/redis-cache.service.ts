import { Redis, RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisCacheService {
  private _cacheManager: Redis;

  constructor(private readonly configService: ConfigService) {
    this._cacheManager = new Redis({
      port: configService.get('cacheServer.redisPort'),
      host: configService.get('cacheServer.redisHost'),
      username: 'default',
      password: configService.get('cacheServer.redisPassword'),
      db: 0,
      ttl: parseInt(configService.get('cacheServer.cacheTtl')),
      keyPrefix: 'customer:',
    } as RedisOptions);
  }

  async set(key: string, value: string | number | Buffer) {
    return await this._cacheManager.set(key, value);
  }

  async get(key: string): Promise<string> {
    return await this._cacheManager.get(key);
  }
}
