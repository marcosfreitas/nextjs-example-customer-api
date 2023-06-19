import { Observable } from 'rxjs';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { SSOService } from '../sso/services/sso.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly ssoService: SSOService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();

    return this.validateRequest(http);
  }

  private async validateRequest(http: HttpArgumentsHost): Promise<boolean> {
    const request = http.getRequest();

    if (!('authorization' in request.headers)) {
      return false;
    }

    const authorizationHeader: string = request.headers.authorization;
    const token: string = authorizationHeader.replace(/^Bearer\s+/i, '');

    if (!token) {
      return false;
    }

    const response = await this.ssoService.getUserInfo(token);

    if ('error' in response) {
      return false;
    }

    return true;
  }
}
