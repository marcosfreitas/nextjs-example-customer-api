import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, AxiosError } from 'axios';
import { SSOService } from './sso.service';
import { of, throwError } from 'rxjs';
import { SSOUserInfoSuccessResponse } from '@infrastructure/sso/contracts/sso-user-info.response';

describe('SSOService Unit Tests', () => {
  let ssoService: SSOService;
  let configService: ConfigService;
  let httpService: HttpService;

  const authUrl = 'https://abc.com/auth';

  beforeEach(() => {
    configService = new ConfigService();
    httpService = new HttpService();
    ssoService = new SSOService(configService, httpService);
    ssoService['_auth_url'] = authUrl;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUserInfo', () => {
    const bearerToken = 'valid_token';

    it('should return SSOUserInfoSuccessResponse if the request is successful', async () => {
      const responseMock: AxiosResponse<SSOUserInfoSuccessResponse> = {
        data: { sub: '123', email_verified: true, preferred_username: 'abc' },
        status: HttpStatus.OK,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(responseMock));

      const result = await ssoService.getUserInfo(bearerToken);

      expect(result).toEqual(responseMock.data);
      expect(httpService.post).toHaveBeenCalledWith(
        `${authUrl}/userinfo`,
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );
    });

    it('should return SSOUserInfoFailedResponse if the request returns UNAUTHORIZED status', async () => {
      const responseMock: AxiosResponse = {
        data: {},
        status: HttpStatus.UNAUTHORIZED,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(responseMock));

      const result = await ssoService.getUserInfo(bearerToken);

      expect(result).toEqual(responseMock.data);
    });

    it('should throw InternalServerErrorException if the request fails with other error status', async () => {
      const responseMock: AxiosResponse = {
        data: {},
        status: HttpStatus.BAD_REQUEST,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      jest
        .spyOn(httpService, 'post')
        .mockResolvedValueOnce(of(responseMock) as never);

      await expect(ssoService.getUserInfo(bearerToken)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw BadGatewayException when the SSO server is unavailable', async () => {
      const errorMock: AxiosError = {
        code: 'ECONNREFUSED',
        message: 'Connection refused',
        config: {} as any,
        request: {},
        response: undefined,
        isAxiosError: true,
        toJSON: () => {
          return {};
        },
        name: '',
      };

      jest
        .spyOn(httpService, 'post')
        .mockReturnValueOnce(throwError(() => errorMock));

      await expect(ssoService.getUserInfo(bearerToken)).rejects.toThrow(
        BadGatewayException,
      );
    });

    it('should throw InternalServerErrorException for other unexpected authorization errors', async () => {
      const errorMock: Error = new Error('Unexpected error');

      jest
        .spyOn(httpService, 'post')
        .mockReturnValueOnce(throwError(() => errorMock));

      await expect(ssoService.getUserInfo(bearerToken)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
