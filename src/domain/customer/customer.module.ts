import { Module } from '@nestjs/common';
import CreateCustomer from 'src/application/use-cases/create-customer/create-customer';
import { CustomerController } from 'src/interfaces/http/controllers/customer/customer.controller';

@Module({
  imports: [],
  providers: [CreateCustomer],
  controllers: [CustomerController],
  exports: [],
})
export class CustomerModule {}
