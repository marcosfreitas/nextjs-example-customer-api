import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomer } from './create-customer';
import { CreateCustomerDto } from '@application/dtos/create-customer.dto';
import { CustomerService } from '@domain/customer/services/customer.service';

describe('CreateCustomer UseCase Unit Tests', () => {
  let useCase: CreateCustomer;
  let customerService: CustomerService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCustomer,
        {
          provide: CustomerService,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get<CreateCustomer>(CreateCustomer);
    customerService = moduleRef.get<CustomerService>(CustomerService);
  });

  it('should create a customer and save it', async () => {
    const createCustomerDto: CreateCustomerDto = {
      document: 1234567890,
      name: 'John Doe',
    };

    await useCase.execute(createCustomerDto);

    expect(customerService.save).toHaveBeenCalledTimes(1);
    expect(customerService.save).toHaveBeenCalledWith(
      expect.any(String), // a generated UUID inside Customer entity
      expect.stringContaining(
        `\"document\":${createCustomerDto.document},\"name\":\"${createCustomerDto.name}\"`,
      ),
    );
  });
});
