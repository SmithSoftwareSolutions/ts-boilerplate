// eslint-disable-next-line @nx/enforce-module-boundaries
import { USER_ROLE } from '@org/nest/auth';

export interface AuthorizedRoles {
  create?: USER_ROLE[];
  read?: USER_ROLE[];
  update?: USER_ROLE[];
  delete?: USER_ROLE[];
}
