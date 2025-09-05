import { userNoteActions } from './user-note.actions';
import { CoreAppState } from '../core-app.state';
import {
  BaseResourceState,
  createBaseResourceReducer,
  initialResourceState,
} from '../create-base-resource-reducer';
import { UserNoteResourceTypeMappings } from '@org/nest/resource';

export type UserNoteState = BaseResourceState<UserNoteResourceTypeMappings>;
export const initialUserNoteState: UserNoteState = initialResourceState;

export const userNoteReducer = createBaseResourceReducer<
  UserNoteResourceTypeMappings,
  UserNoteState
>(initialUserNoteState, userNoteActions);

export const selectUserNoteState = (state: CoreAppState) =>
  state.userNote ?? initialUserNoteState;
