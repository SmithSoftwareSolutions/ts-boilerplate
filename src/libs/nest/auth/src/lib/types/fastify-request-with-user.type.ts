import { FastifyRequest } from 'fastify';
import { AuthenticatedPayload } from './user-payload.type';

export interface FastifyRequestWithUser extends FastifyRequest {
  user?: AuthenticatedPayload;
}
