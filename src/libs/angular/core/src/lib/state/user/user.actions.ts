import { createBaseResourceActions } from '../create-base-resource-actions';
import { UserResourceTypeMappings } from '@org/nest/auth';

const domainSlug = '[USER]';
export const userActions =
  createBaseResourceActions<UserResourceTypeMappings>(domainSlug);
