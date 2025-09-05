import { CoreAppState } from '../state/core-app.state';
import { BaseResourceService } from './base-resource.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RefreshToken } from '@prisma/client';
import { RefreshTokenResourceTypeMappings } from '@org/nest/resource';
import { refreshTokenCompositeKeyOrder } from '@org/nest/resource/objects';

@Injectable()
export class RefreshTokenService extends BaseResourceService<RefreshTokenResourceTypeMappings> {
  constructor(
    protected override readonly http: HttpClient,
    protected override readonly store: Store<CoreAppState>
  ) {
    super(http, store, 'refresh-tokens');
  }
}
