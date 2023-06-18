import { IsNotEmpty, IsString } from 'class-validator';

export class SSOConfig {
  @IsNotEmpty()
  @IsString()
  public readonly authURL: string;

  @IsNotEmpty()
  @IsString()
  public readonly clientId: string;

  @IsNotEmpty()
  @IsString()
  public readonly clientSecret: string;

  @IsNotEmpty()
  @IsString()
  public readonly username: string;

  @IsNotEmpty()
  @IsString()
  public readonly password: string;

  @IsNotEmpty()
  @IsString()
  public readonly grantType: string;

  @IsNotEmpty()
  @IsString()
  public readonly scope: string;
}
