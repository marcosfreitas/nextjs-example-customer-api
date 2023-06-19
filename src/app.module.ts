import { Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { configLoader } from './infrastructure/configuration/config-loader';
import { configValidator } from './infrastructure/configuration/config-validator';

import { CustomerModule } from './domain/customer/customer.module';

import { DevtoolsModule } from '@nestjs/devtools-integration';

//import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
//import { redisStore } from 'cache-manager-ioredis-yet';
//import { Cache, StoreConfig } from 'cache-manager';
import { CacheModule } from './infrastructure/cache/cache.module';

@Module({
  imports: [
    // recommended configuration to validate our environment vars
    ConfigModule.forRoot({
      cache: true,
      isGlobal: false,
      load: [configLoader],
      validate: configValidator,
    }),

    /*CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<CacheModuleOptions<StoreConfig>> => {
        const redisStoreConfig = await redisStore({
          host: configService.get('cacheServer.redisHost'),
          password: configService.get('cacheServer.redisPassword'),
        });

        return {
          isGlobal: true,
          store: redisStoreConfig,
          ttl: parseInt(configService.get('cacheServer.cacheTtl')),
        };
      },
    }),*/

    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),

    CustomerModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
