import { UserNoteService } from './user-note.service';
import { RefreshTokenService } from './refresh-token.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

export const angularCoreServices = [
  AuthService,
  UserService,
  RefreshTokenService,
  UserNoteService,
];
