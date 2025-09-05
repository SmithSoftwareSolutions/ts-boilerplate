import { userActions } from './user.actions';
import { CoreAppState } from '../core-app.state';
import {
  BaseResourceState,
  createBaseResourceReducer,
  initialResourceState,
} from '../create-base-resource-reducer';
import { UserResourceTypeMappings } from '@org/nest/auth';

export type UserState = BaseResourceState<UserResourceTypeMappings>;
export const initialUserState: UserState = initialResourceState;

export const userReducer = createBaseResourceReducer<
  UserResourceTypeMappings,
  UserState
>(initialUserState, userActions);

export const selectUserState = (state: CoreAppState) =>
  state.user ?? initialUserState;
