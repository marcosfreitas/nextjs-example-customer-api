import { Module } from '@nestjs/common';
import { CreateCustomer } from 'src/application/use-cases/create-customer/create-customer';
import { SsoModule } from 'src/infrastructure/sso/sso.module';
import { CustomerController } from 'src/interfaces/http/controllers/customer/customer.controller';

@Module({
  imports: [SsoModule],
  providers: [CreateCustomer],
  controllers: [CustomerController],
  exports: [],
})
export class CustomerModule {}
