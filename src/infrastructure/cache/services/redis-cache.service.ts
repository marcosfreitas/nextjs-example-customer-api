import { Redis, RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Environment } from '@src/infrastructure/configuration/contracts/env.config';

@Injectable()
export class RedisCacheService {
  private _cacheManager: Redis;

  constructor(private readonly configService: ConfigService, client: Redis) {
    this._cacheManager = client;
  }

  async set(key: string, value: string | number | Buffer) {
    return await this._cacheManager.set(key, value);
  }

  async get(key: string): Promise<string> {
    return await this._cacheManager.get(key);
  }
}
