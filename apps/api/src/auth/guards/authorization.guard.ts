import { Injectable, Logger } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';
import { Observable } from 'rxjs';

import type { RouteAccessType } from '@/core/decorators/route-access.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    this.logger.verbose(`Request URL: ${request.url}`);

    const routeAccess = this.reflector.getAllAndOverride<RouteAccessType | undefined>('RouteAccess', [
      context.getHandler(),
      context.getClass()
    ]);

    if (routeAccess === 'public') {
      return true;
    } else if (!routeAccess) {
      return false;
    }

    return request.user?.ability.can(routeAccess.action, routeAccess.subject) ?? false;
  }
}
