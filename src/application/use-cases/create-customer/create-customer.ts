import { Injectable, Logger } from '@nestjs/common';
import { CreateCustomerDto } from 'src/application/dtos/create-customer.dto';
import { SSOService } from 'src/infrastructure/sso/services/sso.service';

@Injectable()
export class CreateCustomer {
  constructor(private readonly ssoService: SSOService) {}
  public async execute(request: CreateCustomerDto): Promise<any> {
    return request;
  }
}
