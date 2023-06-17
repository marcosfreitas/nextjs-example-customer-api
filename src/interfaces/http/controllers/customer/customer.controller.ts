import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCustomerDto } from 'src/application/dtos/create-customer.dto';
import CreateCustomer from 'src/application/use-cases/create-customer/create-customer';

@Controller('customers')
export class CustomerController {
  constructor(private createCustomer: CreateCustomer) {}

  @Post()
  @HttpCode(201)
  public async create(@Body() request: CreateCustomerDto) {
    return await this.createCustomer.execute(request);
  }
}
