import { ConfigModule } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RedisCacheService } from './redis-cache.service';
import { Test } from '@nestjs/testing';

describe('RedisCacheService Unit Tests', () => {
  let redisCacheService: RedisCacheService;
  let redisMock: Redis;

  beforeEach(async () => {
    redisMock = {
      set: jest.fn(),
      get: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        {
          provide: Redis,
          useValue: redisMock,
        },
        RedisCacheService,
      ],
    }).compile();

    redisCacheService = moduleRef.get<RedisCacheService>(RedisCacheService);
  });

  describe('set', () => {
    it('should set the key-value pair in the cache', async () => {
      const key = 'test-key';
      const value = 'test-value';

      await redisCacheService.set(key, value);

      expect(redisMock.set).toHaveBeenCalledTimes(1);
      expect(redisMock.set).toHaveBeenCalledWith(key, value);
    });
  });

  describe('get', () => {
    it('should retrieve the value for the given key from the cache', async () => {
      const key = 'test-key';
      const value = 'test-value';

      jest.spyOn(redisMock, 'get').mockResolvedValueOnce(value);

      const result = await redisCacheService.get(key);

      expect(redisMock.get).toHaveBeenCalledTimes(1);
      expect(redisMock.get).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
    });
  });
});
