import { Module } from '@nestjs/common';
import { CreateCustomer } from '@application/use-cases/create-customer/create-customer';
import { SsoModule } from '@infrastructure/sso/sso.module';
import { CustomerController } from 'src/interfaces/http/controllers/customer/customer.controller';
import { CustomerService } from './services/customer.service';
//import { CacheModule } from '@nestjs/cache-manager';
import { GetCustomer } from '@application/use-cases/create-customer/get-customer';
import { CacheModule } from '@infrastructure/cache/cache.module';
import { UpdateCustomer } from '@application/use-cases/create-customer/update-customer';

@Module({
  imports: [
    SsoModule,
    CacheModule,
    //CacheModule.register()
  ],
  providers: [CreateCustomer, GetCustomer, UpdateCustomer, CustomerService],
  controllers: [CustomerController],
  exports: [],
})
export class CustomerModule {}
