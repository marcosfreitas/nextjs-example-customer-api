import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';

import {
  SSOUserInfoFailedResponse,
  SSOUserInfoSuccessResponse,
} from '@infrastructure/sso/contracts/sso-user-info.response';
import { SSOService } from '@infrastructure/sso/services/sso.service';
import { AuthorizationGuard } from './authorization.guard';

function createMockHttp(mockRequest: any): HttpArgumentsHost {
  return {
    getRequest: jest.fn().mockReturnValue(mockRequest),
    getResponse: jest.fn(() => {
      throw new Error('Mock not implemented');
    }),
    getNext: jest.fn(() => {
      throw new Error('Mock not implemented');
    }),
  };
}

function createMockContext(mockHttp: HttpArgumentsHost): ExecutionContext {
  return {
    switchToHttp: jest.fn().mockReturnValue(mockHttp),
    getClass: jest.fn(() => {
      throw new Error('Mock not implemented');
    }),
    getHandler: jest.fn(() => {
      throw new Error('Mock not implemented');
    }),
    getArgs: jest.fn(() => {
      throw new Error('Mock not implemented');
    }),
    getArgByIndex: jest.fn(() => {
      throw new Error('Mock not implemented');
    }),
    switchToRpc: jest.fn(() => {
      throw new Error('Mock not implemented');
    }),
    switchToWs: jest.fn(() => {
      throw new Error('Mock not implemented');
    }),
    getType: jest.fn(() => {
      throw new Error('Mock not implemented');
    }),
  };
}

describe('AuthorizationGuard Unit Tests', () => {
  let authGuard: AuthorizationGuard;
  let ssoService: SSOService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationGuard,
        {
          provide: SSOService,
          useValue: {
            getUserInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthorizationGuard>(AuthorizationGuard);
    ssoService = module.get<SSOService>(SSOService);
  });

  describe('canActivate', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return true for a valid token', async () => {
      const mockToken = 'valid_token';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      };
      const mockHttp = createMockHttp(mockRequest);
      const mockContext = createMockContext(mockHttp);

      const userInfoResponse = {} as SSOUserInfoSuccessResponse;
      jest
        .spyOn(ssoService, 'getUserInfo')
        .mockResolvedValueOnce(userInfoResponse);

      const canActivateResult = await authGuard.canActivate(mockContext);

      expect(canActivateResult).toBe(true);
      expect(ssoService.getUserInfo).toHaveBeenCalledWith(mockToken);
    });

    it('should return false when authorization header is not present', async () => {
      const mockRequest = {
        headers: {},
      };
      const mockHttp = createMockHttp(mockRequest);
      const mockContext = createMockContext(mockHttp);

      const userInfoResponse = {} as SSOUserInfoSuccessResponse;
      jest
        .spyOn(ssoService, 'getUserInfo')
        .mockResolvedValueOnce(userInfoResponse);

      const canActivateResult = await authGuard.canActivate(mockContext);

      expect(canActivateResult).toBe(false);
      expect(ssoService.getUserInfo).not.toHaveBeenCalled();
    });

    it('should return false for an invalid token', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer ',
        },
      };
      const mockHttp = createMockHttp(mockRequest);
      const mockContext = createMockContext(mockHttp);

      const userInfoResponse = {} as SSOUserInfoSuccessResponse;
      jest
        .spyOn(ssoService, 'getUserInfo')
        .mockResolvedValueOnce(userInfoResponse);

      const canActivateResult = await authGuard.canActivate(mockContext);

      expect(canActivateResult).toBe(false);
      expect(ssoService.getUserInfo).not.toHaveBeenCalled();
    });

    it('should return false when getUserInfo returns SSOUserInfoFailedResponse', async () => {
      const mockToken = 'valid_token';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      };
      const mockHttp = createMockHttp(mockRequest);
      const mockContext = createMockContext(mockHttp);

      const userInfoResponse = {
        error: 'abc',
        error_description: 'lorem ipsum',
      } as SSOUserInfoFailedResponse;

      jest
        .spyOn(ssoService, 'getUserInfo')
        .mockResolvedValueOnce(userInfoResponse);

      const canActivateResult = await authGuard.canActivate(mockContext);

      expect(canActivateResult).toBe(false);
      expect(ssoService.getUserInfo).toHaveBeenCalledWith(mockToken);
    });
  });
});
