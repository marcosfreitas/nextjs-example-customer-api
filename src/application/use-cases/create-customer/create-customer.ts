import { CreateCustomerDto } from 'src/application/dtos/create-customer.dto';

export default class CreateCustomer {
  public async execute(request: CreateCustomerDto): Promise<any> {
    return request;
  }
}
