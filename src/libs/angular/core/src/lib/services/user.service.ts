import { CoreAppState } from '../state/core-app.state';
import { BaseResourceService } from './base-resource.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserResourceTypeMappings } from '@org/nest/auth';

@Injectable()
export class UserService extends BaseResourceService<UserResourceTypeMappings> {
  constructor(
    protected override readonly http: HttpClient,
    protected override readonly store: Store<CoreAppState>
  ) {
    super(http, store, 'users');
  }
}
