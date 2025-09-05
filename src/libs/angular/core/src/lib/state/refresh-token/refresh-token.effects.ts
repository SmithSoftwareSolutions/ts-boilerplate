import { Actions } from '@ngrx/effects';
import { BaseResourceEffects } from '../base-resource.effects';
import { refreshTokenActions } from './refresh-token.actions';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { CoreAppState } from '../core-app.state';
import { Injectable } from '@angular/core';
import { selectRefreshTokenState } from './refresh-token.reducer';
import { Store } from '@ngrx/store';
import { RefreshTokenResourceTypeMappings } from '@org/nest/resource';

@Injectable()
export class RefreshTokenEffects extends BaseResourceEffects<RefreshTokenResourceTypeMappings> {
  constructor(
    protected override readonly actions$: Actions,
    protected override readonly store: Store<CoreAppState>,
    protected override readonly service: RefreshTokenService
  ) {
    super(
      actions$,
      store,
      service,
      refreshTokenActions,
      selectRefreshTokenState
    );
  }
}
