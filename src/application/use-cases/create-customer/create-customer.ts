import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '@application/dtos/create-customer.dto';
import Customer from '@domain/customer/entity/customer';
import { CustomerService } from '@domain/customer/services/customer.service';

@Injectable()
export class CreateCustomer {
  constructor(private readonly customerService: CustomerService) {}
  public async execute(request: CreateCustomerDto): Promise<void> {
    const customer = new Customer(request.document, request.name);

    await this.customerService.save(
      customer.uuid,
      JSON.stringify(customer.toObject()),
    );
  }
}
