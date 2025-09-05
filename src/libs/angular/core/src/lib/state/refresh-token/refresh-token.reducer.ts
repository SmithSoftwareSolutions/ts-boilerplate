import { refreshTokenActions } from './refresh-token.actions';
import { CoreAppState } from '../core-app.state';
import {
  BaseResourceState,
  createBaseResourceReducer,
  initialResourceState,
} from '../create-base-resource-reducer';
import { RefreshTokenResourceTypeMappings } from '@org/nest/resource';

export type RefreshTokenState =
  BaseResourceState<RefreshTokenResourceTypeMappings>;
export const initialRefreshTokenState: RefreshTokenState = initialResourceState;

export const refreshTokenReducer = createBaseResourceReducer<
  RefreshTokenResourceTypeMappings,
  RefreshTokenState
>(initialRefreshTokenState, refreshTokenActions);

export const selectRefreshTokenState = (state: CoreAppState) =>
  state.refreshToken ?? initialRefreshTokenState;
