import { CreateCustomerDto } from '@application/dtos/create-customer.dto';
import { UpdateCustomerDto } from '@application/dtos/update-customer.dto';

import { CreateCustomer } from '@application/use-cases/create-customer/create-customer';
import { UpdateCustomer } from '@application/use-cases/create-customer/update-customer';
import { GetCustomer } from '@application/use-cases/create-customer/get-customer';

import Customer from '@domain/customer/entity/customer';

import { Test } from '@nestjs/testing';

import { CustomerController } from './customer.controller';

import { AuthorizationGuard } from '@infrastructure/guards/authorization.guard';
import { SSOService } from '@infrastructure/sso/services/sso.service';

describe('CustomerController Unit Tests', () => {
  let customerController: CustomerController;
  let createCustomer: CreateCustomer;
  let getCustomer: GetCustomer;
  let updateCustomer: UpdateCustomer;

  const defaultCustomerMock = new Customer(1001, 'Gunter');

  beforeEach(async () => {
    const responseMock = jest
      .fn()
      .mockResolvedValue(defaultCustomerMock.toObject());

    const module = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        AuthorizationGuard,
        {
          provide: SSOService,
          useValue: {
            getUserInfo: jest.fn(),
          },
        },
        {
          provide: CreateCustomer,
          useValue: {
            execute: responseMock,
          },
        },
        {
          provide: GetCustomer,
          useValue: {
            execute: responseMock,
          },
        },
        {
          provide: UpdateCustomer,
          useValue: {
            execute: responseMock,
          },
        },
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    createCustomer = module.get<CreateCustomer>(CreateCustomer);
    getCustomer = module.get<GetCustomer>(GetCustomer);
    updateCustomer = module.get<UpdateCustomer>(UpdateCustomer);
  });

  describe('create', () => {
    it('should call createCustomer.execute and return the mocked customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: defaultCustomerMock.name,
        document: defaultCustomerMock.document,
      };

      const result = await customerController.create(createCustomerDto);

      expect(createCustomer.execute).toHaveBeenCalledWith(createCustomerDto);
      expect(result).toEqual(defaultCustomerMock.toObject());
    });
  });

  describe('get', () => {
    it('should call getCustomer.execute and return the mocked customer', async () => {
      const result = await customerController.get(defaultCustomerMock.uuid);

      expect(getCustomer.execute).toHaveBeenCalledWith(
        defaultCustomerMock.uuid,
      );
      expect(result).toEqual(defaultCustomerMock.toObject());
    });
  });

  describe('update', () => {
    it('should call updateCustomer.execute and return the mocked customer', async () => {
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'Gunter Son',
        document: 1002,
        uuid: 'uuid-uuid-uuid-uuid-uuid',
      };

      const result = await customerController.update(
        defaultCustomerMock.uuid,
        updateCustomerDto,
      );

      expect(updateCustomer.execute).toHaveBeenCalledWith(
        defaultCustomerMock.uuid,
        updateCustomerDto,
      );
      expect(result).toEqual(defaultCustomerMock.toObject());
    });
  });
});
