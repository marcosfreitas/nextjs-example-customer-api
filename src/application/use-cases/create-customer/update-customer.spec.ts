import Customer from '@domain/customer/entity/customer';
import { CustomerService } from '@domain/customer/services/customer.service';
import { Test, TestingModule } from '@nestjs/testing';

import { UpdateCustomer } from './update-customer';
import { UpdateCustomerDto } from '@src/application/dtos/update-customer.dto';
import { NotFoundException } from '@nestjs/common';

describe('UpdateCustomer UseCase Unit Tests', () => {
  let useCase: UpdateCustomer;
  let customerService: CustomerService;
  const mockCacheService = {
    get: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCustomer,
        {
          provide: CustomerService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    useCase = moduleRef.get<UpdateCustomer>(UpdateCustomer);
    customerService = moduleRef.get<CustomerService>(CustomerService);
  });

  it('should update the customer and return the updated data', async () => {
    const originalCustomer = new Customer(123456, 'Dudu');
    const updateData: UpdateCustomerDto = {
      uuid: originalCustomer.uuid,
      document: originalCustomer.document,
      name: 'Dunga Maria',
    };
    mockCacheService.get
      .mockResolvedValueOnce(originalCustomer) // first call
      .mockResolvedValueOnce(updateData); // second call

    mockCacheService.save.mockResolvedValueOnce('OK');

    const result = await useCase.execute(updateData.uuid, updateData);

    expect(customerService.get).toHaveBeenCalledWith(updateData.uuid);
    expect(customerService.save).toHaveBeenCalledWith(
      updateData.uuid,
      JSON.stringify(updateData),
    );

    expect(result).toEqual(updateData);
  });

  it('should throw NotFoundException if customer data is not found', async () => {
    const updateData: UpdateCustomerDto = {
      uuid: 'non-existent-uuid-uuid-uuid',
      document: 123456,
      name: 'Dunga Maria',
    };

    // redefining mock on these methods to avoid conflicts
    mockCacheService.get.mockClear();
    mockCacheService.save.mockClear();
    jest.spyOn(mockCacheService, 'get');
    jest.spyOn(mockCacheService, 'save');

    mockCacheService.get.mockResolvedValueOnce(null); // no found

    await expect(
      useCase.execute(updateData.uuid, updateData),
    ).rejects.toThrowError(NotFoundException);

    expect(customerService.get).toHaveBeenCalledWith(updateData.uuid);
    expect(customerService.get).toHaveBeenCalledTimes(1);
    expect(customerService.save).not.toHaveBeenCalled();
  });
});
