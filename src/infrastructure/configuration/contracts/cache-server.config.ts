import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CacheServerConfig {
  @IsNotEmpty()
  @IsString()
  redisHost: string;

  @IsNotEmpty()
  @IsNumberString()
  redisPort: string;

  @IsNotEmpty()
  @IsString()
  redisPassword: string;

  @IsNotEmpty()
  @IsNumberString()
  cacheTtl: string;
}
