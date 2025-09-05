import { UserNoteState } from './user-note/user-note.reducer';
import { RefreshTokenState } from './refresh-token/refresh-token.reducer';
import { UserState } from './user/user.reducer';
import { AuthState } from './auth/auth.reducer';

export interface CoreAppState {
  isMainApp: boolean;
  sidenavIsOpen?: boolean;
  auth: AuthState;
  user?: UserState;
  refreshToken?: RefreshTokenState;
  userNote?: UserNoteState;
}
