import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { CustomerService } from '@domain/customer/services/customer.service';

@Injectable()
export class GetCustomer {
  constructor(private readonly customerService: CustomerService) {}
  public async execute(uuid: UUID): Promise<Record<string, any>> {
    const data = await this.customerService.get(uuid);

    if (!data) {
      throw new NotFoundException();
    }

    Logger.debug('data', data);
    return JSON.parse(data);
  }
}
