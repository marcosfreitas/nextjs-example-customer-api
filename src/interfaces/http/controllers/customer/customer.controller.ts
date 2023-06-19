import { UUID } from 'crypto';

import { CreateCustomerDto } from '@application/dtos/create-customer.dto';
import { UpdateCustomerDto } from '@application/dtos/update-customer.dto';
import { CreateCustomer } from '@application/use-cases/create-customer/create-customer';
import { GetCustomer } from '@application/use-cases/create-customer/get-customer';
import { UpdateCustomer } from '@application/use-cases/create-customer/update-customer';
import { AuthorizationGuard } from '@infrastructure/guards/authorization.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

@Controller('customers')
@UseGuards(AuthorizationGuard)
export class CustomerController {
  constructor(
    private createCustomer: CreateCustomer,
    private getCustomer: GetCustomer,
    private updateCustomer: UpdateCustomer,
  ) {}

  @Post()
  @HttpCode(201)
  public async create(@Body() request: CreateCustomerDto) {
    return await this.createCustomer.execute(request);
  }

  @Get(':uuid')
  public async get(@Param('uuid', ParseUUIDPipe) uuid: UUID) {
    return await this.getCustomer.execute(uuid);
  }

  @Put(':uuid')
  public async update(
    @Param('uuid', ParseUUIDPipe) uuid: UUID,
    @Body() request: UpdateCustomerDto,
  ) {
    return await this.updateCustomer.execute(uuid, request);
  }
}
