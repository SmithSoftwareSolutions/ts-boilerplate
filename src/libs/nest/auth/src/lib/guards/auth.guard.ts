import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { TokenExpiredError } from 'jsonwebtoken';
import { USER_ROLE } from '../enums/user-role.enum';
import { TokenService } from '../services/token.service';
import { FastifyRequestWithUser } from '../types/fastify-request-with-user.type';
import { AuthenticatedPayload } from '../types/user-payload.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: USER_ROLE[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as FastifyRequest;
    const asWs = context.switchToWs().getClient();

    const authorizedRoles =
      this.reflector.getAllAndOverride<USER_ROLE[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];
    let accessToken: string | undefined | null = this.getAccessTokenFromBearer(
      request.headers?.authorization ?? asWs.handshake?.headers?.authorization
    );
    if (!accessToken) {
      const cookieHeader =
        request.headers?.cookie ?? asWs.handshake?.headers?.['cookie'];
      accessToken = this.getAccessTokenFromCookieString(cookieHeader);
    }

    const decoded = await this.handleAccessToken(accessToken, authorizedRoles);

    (request as FastifyRequestWithUser).user = decoded;
    return true;
  }

  getAccessTokenFromBearer(authHeader?: string) {
    if (authHeader && authHeader.includes('Bearer')) {
      return authHeader.split(' ')[1];
    }

    return null;
  }

  getAccessTokenFromCookieString(cookieHeader?: string) {
    const splitCookiesString = cookieHeader?.split(';');
    const cookies: Record<string, string> | undefined =
      splitCookiesString?.reduce(
        (mappedCookies: Record<string, string>, cookieString: string) => {
          const splitCookieString = cookieString.split('=');
          mappedCookies[splitCookieString?.[0]?.replace(' ', '')] =
            splitCookieString?.[1];
          return mappedCookies;
        },
        {}
      );

    return cookies?.['access-token'];
  }

  async handleAccessToken(
    accessToken: string | undefined,
    authorizedRoles: USER_ROLE[]
  ) {
    try {
      if (!accessToken || accessToken == 'null') {
        throw new UnauthorizedException('No access token provided');
      }

      const decoded = await this.tokenService.validateJWT<AuthenticatedPayload>(
        accessToken
      );

      let containsAcceptableRole = false;
      for (const role of authorizedRoles) {
        if ((decoded.roles ?? []).includes(role)) {
          containsAcceptableRole = true;
          break;
        }
      }

      if (!containsAcceptableRole && authorizedRoles.length > 0) {
        throw new ForbiddenException(
          `User without one of [${authorizedRoles
            .map((rid) =>
              Object.values(USER_ROLE)
                .filter((v) => !(Number(v) >= 0))
                .find((ur) => (USER_ROLE as any)[ur] == rid)
            )
            .join(', ')}] roles cannot perform specified action`
        );
      }

      return decoded;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Access token expired');
      }

      throw e;
    }
  }
}
