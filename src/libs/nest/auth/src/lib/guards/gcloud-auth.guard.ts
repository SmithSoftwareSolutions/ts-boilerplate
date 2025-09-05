import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class GCloudAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as FastifyRequest;

    const accessToken = request.headers.authorization?.split(' ')[1];

    return accessToken == process.env['INGRESS_GCLOUD_API_KEY'];
  }
}
