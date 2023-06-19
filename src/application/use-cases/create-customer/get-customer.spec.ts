import Customer from '@domain/customer/entity/customer';
import { CustomerService } from '@domain/customer/services/customer.service';
import { Test, TestingModule } from '@nestjs/testing';

import { GetCustomer } from './get-customer';
import { UUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

describe('GetCustomer UseCase Unit Tests', () => {
  let useCase: GetCustomer;
  let customerService: CustomerService;
  const mockCustomerService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        GetCustomer,
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    useCase = moduleRef.get<GetCustomer>(GetCustomer);
    customerService = moduleRef.get<CustomerService>(CustomerService);
  });

  it('if found, should get a customer by a given UUID', async () => {
    const customer = new Customer(123, 'Dunga');
    const cacheValue = JSON.stringify(customer.toObject());

    mockCustomerService.get.mockResolvedValueOnce(cacheValue);
    jest.spyOn(useCase, 'execute');

    const result = await useCase.execute(customer.uuid);

    expect(customerService.get).toHaveBeenCalledTimes(1);
    expect(customerService.get).toHaveBeenCalledWith(customer.uuid);
    expect(result).toEqual(JSON.parse(cacheValue));
  });

  it('if not found, should throw a NotFoundException', async () => {
    mockCustomerService.get.mockResolvedValueOnce(null);

    const uuid: UUID = 'uuid-uuid-uuid-uuid-uuid';

    await expect(useCase.execute(uuid)).rejects.toThrowError(NotFoundException);

    expect(customerService.get).toHaveBeenCalledWith(uuid);
  });
});
