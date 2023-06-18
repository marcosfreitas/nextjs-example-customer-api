import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, AxiosError } from 'axios';
import {
  SSOUserInfoFailedResponse,
  SSOUserInfoSuccessResponse,
} from '../contracts/sso-user-info.response';

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
      const data = {
        client_id: this.client_id,
        client_secret: this.client_secret,
        username: this.username,
        password: this.password,
        grant_type: this.grant_type,
        scope: this.scope,
      };

      const response = await firstValueFrom<
        AxiosResponse<SSOUserInfoSuccessResponse>
      >(
        this.httpService.post(`${this._auth_url}/userinfo`, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${bearerToken}`,
          },
        }),
      ).catch((reason) => {
        if (reason.response.status === HttpStatus.UNAUTHORIZED) {
          Logger.error(
            'Invalid Token: Authorization failed at SSO service',
            reason.response,
          );
          const errorData = reason.response;

          return errorData;
        }

        return reason;
      });

      return response.data;
    } catch (error: any) {
      if ((error as AxiosError) && error?.response?.status) {
        Logger.error(
          'Authorization failed at SSO service',
          error as AxiosError,
        );
        throw new BadGatewayException();
      }

      Logger.error(
        'Unexpected Authorization error during SSO service request',
        error,
      );
      throw new InternalServerErrorException();
    }
  }
}
