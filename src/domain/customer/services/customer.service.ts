import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '@infrastructure/cache/services/redis-cache.service';

@Injectable()
export class CustomerService {
  constructor(private readonly cacheService: RedisCacheService) {}

  // @bug requests for the same customer will be duplicated in redis
  async save(key: string, value: string | number | Buffer) {
    return await this.cacheService.set(key, value);
  }

  async get(key: string): Promise<string> {
    return await this.cacheService.get(key);
  }
}
