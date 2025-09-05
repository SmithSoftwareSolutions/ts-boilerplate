import { UserNoteModule } from './user-note/user-note.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { UserModule } from './user/user.module';

export const resourceModules = [UserModule, RefreshTokenModule, UserNoteModule];
