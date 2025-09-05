import { createAction, props } from '@ngrx/store';
import { User } from '@prisma/client';

const domainSlug = '[AUTH]';

const login = createAction(
  `${domainSlug} Login`,
  props<{ email: string; password: string }>()
);

const register = createAction(
  `${domainSlug} Register`,
  props<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }>()
);

const updateProfile = createAction(
  `${domainSlug} Update Profile`,
  props<{
    firstName?: string;
    lastName?: string;
    email?: string;
    receiveEmailNotifications?: boolean;
  }>()
);

const setUser = createAction(`${domainSlug} Set User`, props<{ user: User }>());
const setError = createAction(
  `${domainSlug} Set Error`,
  props<{ message?: string }>()
);
const clearError = createAction(`${domainSlug} Clear Error`);

const setOriginalPath = createAction(
  `${domainSlug} Set Original Path`,
  props<{ path: string }>()
);

const clearOriginalPath = createAction(`${domainSlug} Set Original Path`);

const logout = createAction(`${domainSlug} Logout`);
export const authActions = {
  login,
  register,
  setOriginalPath,
  clearOriginalPath,
  updateProfile,
  setUser,
  setError,
  clearError,
  logout,
};
