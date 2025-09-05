import { Actions } from '@ngrx/effects';
import { BaseResourceEffects } from '../base-resource.effects';
import { userNoteActions } from './user-note.actions';
import { UserNoteService } from '../../services/user-note.service';
import { CoreAppState } from '../core-app.state';
import { Injectable } from '@angular/core';
import { selectUserNoteState } from './user-note.reducer';
import { Store } from '@ngrx/store';
import { UserNoteResourceTypeMappings } from '@org/nest/resource';

@Injectable()
export class UserNoteEffects extends BaseResourceEffects<UserNoteResourceTypeMappings> {
  constructor(
    protected override readonly actions$: Actions,
    protected override readonly store: Store<CoreAppState>,
    protected override readonly service: UserNoteService
  ) {
    super(actions$, store, service, userNoteActions, selectUserNoteState);
  }
}
