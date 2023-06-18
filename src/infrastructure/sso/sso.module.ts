import { Module } from '@nestjs/common';
import { SSOService } from './services/sso.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [SSOService],
  exports: [SSOService],
})
export class SsoModule {}
