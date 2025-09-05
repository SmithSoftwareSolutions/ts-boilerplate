import { Actions } from '@ngrx/effects';
import { BaseResourceEffects } from '../base-resource.effects';
import { userActions } from './user.actions';
import { UserService } from '../../services/user.service';
import { CoreAppState } from '../core-app.state';
import { Injectable } from '@angular/core';
import { selectUserState } from './user.reducer';
import { Store } from '@ngrx/store';
import { UserResourceTypeMappings } from '@org/nest/auth';

@Injectable()
export class UserEffects extends BaseResourceEffects<UserResourceTypeMappings> {
  constructor(
    protected override readonly actions$: Actions,
    protected override readonly store: Store<CoreAppState>,
    protected override readonly service: UserService
  ) {
    super(actions$, store, service, userActions, selectUserState);
  }
}
