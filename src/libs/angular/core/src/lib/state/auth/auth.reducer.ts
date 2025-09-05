import { authActions } from './auth.actions';
import { CoreAppState } from '../core-app.state';
import { createReducer, on } from '@ngrx/store';
import { User } from '@prisma/client';
import { UserResourceTypeMappings } from '@org/nest/auth';

export interface AuthState {
  user?: UserResourceTypeMappings['resourceWithRelationsT'];
  error?: string | null;
  originalPath?: string | null;
}

export const initialAuthState: AuthState = {};

export const authReducer = createReducer(
  initialAuthState,
  on(authActions.login, (state) => ({ ...state, error: null })),
  on(authActions.setUser, (state, payload: { user: User }) => ({
    ...state,
    ...payload,
  })),
  on(authActions.setError, (state, payload) => ({
    ...state,
    error: payload.message,
  })),
  on(authActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
  on(authActions.setOriginalPath, (state, payload) => ({
    ...state,
    originalPath: payload.path,
  })),
  on(authActions.clearOriginalPath, (state) => ({
    ...state,
    originalPath: null,
  })),
  on(authActions.logout, (state) => ({}))
);

export const selectAuth = (state: CoreAppState) => state.auth;
