import { IsDefined } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';
import { UUID } from 'crypto';

export class UpdateCustomerDto extends CreateCustomerDto {
  @IsDefined()
  uuid: UUID;
}
