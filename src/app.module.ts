import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configLoader } from './infrastructure/configuration/config-loader';
import { configValidator } from './infrastructure/configuration/config-validator';

import { CustomerModule } from './domain/customer/customer.module';

@Module({
  imports: [
    // recommended configuration to validate our environment vars
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configLoader],
      validate: configValidator,
    }),

    // @todo add TypeORM to work with Redis

    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
