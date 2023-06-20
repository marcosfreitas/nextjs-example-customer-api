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
