import { UserResourceTypeMappings } from './user.resource-type-mappings';

export interface AuthResponse {
  message?: string;
  data: {
    user: UserResourceTypeMappings['resourceWithRelationsT'];
  };
}
