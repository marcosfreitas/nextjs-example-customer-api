import { UUID } from 'crypto';

import { UpdateCustomerDto } from '@application/dtos/update-customer.dto';
import Customer from '@domain/customer/entity/customer';
import { CustomerService } from '@domain/customer/services/customer.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UpdateCustomer {
  constructor(private readonly customerService: CustomerService) {}
  public async execute(
    uuid: UUID,
    request: UpdateCustomerDto,
  ): Promise<string> {
    const data = await this.customerService.get(uuid);

    if (!data) {
      throw new NotFoundException();
    }

    // entity self-validation
    const customer = new Customer(request.document, request.name);
    const customerObject = customer.toObject();
    customerObject.uuid = uuid;

    await this.customerService.save(
      customerObject.uuid,
      JSON.stringify(customerObject),
    );

    return await this.customerService.get(uuid);
  }
}
