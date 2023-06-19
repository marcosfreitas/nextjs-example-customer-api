import { Test, TestingModule } from '@nestjs/testing';

import { CustomerService } from './customer.service';
import { RedisCacheService } from '@infrastructure/cache/services/redis-cache.service';

describe('CustomerService Unit Tests', () => {
  let customerService: CustomerService;
  let cacheService: RedisCacheService;

  const mockCacheService = {
    set: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: RedisCacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    cacheService = module.get<RedisCacheService>(RedisCacheService);
  });

  describe('save', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call cacheService.set with the provided key and value', async () => {
      const key = 'customer:1';
      const value = 'Gunter';

      await customerService.save(key, value);

      expect(cacheService.set).toHaveBeenCalledWith(key, value);
    });
  });

  describe('get', () => {
    it('should call cacheService.get with the provided key', async () => {
      const key = 'customer:1';
      const expectedValue = 'Gunter';
      mockCacheService.get.mockResolvedValueOnce(expectedValue);

      const result = await customerService.get(key);

      expect(cacheService.get).toHaveBeenCalledWith(key);
      expect(result).toBe(expectedValue);
    });
  });
});
