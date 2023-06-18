import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configLoader } from './infrastructure/configuration/config-loader';
import { configValidator } from './infrastructure/configuration/config-validator';

import { CustomerModule } from './domain/customer/customer.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    // recommended configuration to validate our environment vars
    ConfigModule.forRoot({
      cache: true,
      isGlobal: false,
      load: [configLoader],
      validate: configValidator,
    }),

    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),

    // @todo add TypeORM to work with Redis

    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
