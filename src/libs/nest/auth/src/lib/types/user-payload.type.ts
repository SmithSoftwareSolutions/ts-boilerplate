import { USER_ROLE } from '../enums/user-role.enum';

export interface AuthenticatedPayload {
  userId?: number;
  email?: string;
  roles?: USER_ROLE[];
  iat?: number;
  exp?: number;
}
