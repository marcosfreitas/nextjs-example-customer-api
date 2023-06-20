import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

import { AppConfig } from './app.config';
import { SSOConfig } from './sso.config';
import { CacheServerConfig } from './cache-server.config';

export class GlobalConfig {
  @IsDefined()
  public readonly application: AppConfig;

  @ValidateNested()
  @Type(() => SSOConfig)
  @IsDefined()
  public sso: SSOConfig;

  @ValidateNested()
  @Type(() => CacheServerConfig)
  @IsDefined()
  public cacheServer: CacheServerConfig;
}
