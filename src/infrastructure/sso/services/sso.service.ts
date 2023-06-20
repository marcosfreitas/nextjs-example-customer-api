import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import {
  SSOUserInfoFailedResponse,
  SSOUserInfoSuccessResponse,
} from '../contracts/sso-user-info.response';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SSOService {
  private _auth_url = '';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this._auth_url = configService.get<string>('sso.authURL');
  }

  /**
   * @throws BadGatewayException, InternalServerErrorException
   * @param bearerToken string
   * @returns Promise<SSOUserInfoSuccessResponse | SSOUserInfoFailedResponse>
   */
  public async getUserInfo(
    bearerToken: string,
  ): Promise<SSOUserInfoSuccessResponse | SSOUserInfoFailedResponse> {
    try {
      const response = await firstValueFrom<
        AxiosResponse<SSOUserInfoSuccessResponse>
      >(
        this.httpService.post(
          `${this._auth_url}/userinfo`,
          {},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${bearerToken}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === HttpStatus.UNAUTHORIZED) {
          Logger.error(
            'Invalid Token: Authorization failed at SSO service',
            error.response,
          );
          return error.response.data;
        }
      } else if (error.code === 'ECONNREFUSED') {
        Logger.error('Unavailable SSO Server: Connection refused');
        throw new BadGatewayException('Unavailable SSO Server');
      }

      Logger.error('Unexpected error during SSO service request', error);
      throw new InternalServerErrorException();
    }
  }
}
