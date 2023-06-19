import { IsDefined } from 'class-validator';

export class GetCustomerDto {
  @IsDefined()
  uuid: string;
}
