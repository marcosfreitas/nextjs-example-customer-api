import { IsDefined, IsNumber, IsNumberString } from 'class-validator';

export class DatabaseConfig {
  @IsDefined()
  public readonly driver: 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'redis';

  @IsDefined()
  public readonly host: string;

  @IsDefined()
  @IsNumberString()
  public readonly port: string;

  @IsDefined()
  public readonly name: string;

  @IsDefined()
  public readonly user: string;

  @IsDefined()
  public readonly password: string;
}
