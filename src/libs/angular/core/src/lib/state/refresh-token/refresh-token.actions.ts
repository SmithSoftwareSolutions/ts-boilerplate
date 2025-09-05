import { createBaseResourceActions } from '../create-base-resource-actions';
import { RefreshTokenResourceTypeMappings } from '@org/nest/resource';

const domainSlug = '[REFRESH TOKEN]';
export const refreshTokenActions =
  createBaseResourceActions<RefreshTokenResourceTypeMappings>(domainSlug);
