import { IsNotEmpty, IsString } from 'class-validator';

export class SSOConfig {
  @IsNotEmpty()
  @IsString()
  public readonly authURL: string;
}
