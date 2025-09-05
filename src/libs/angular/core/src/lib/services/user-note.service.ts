import { CoreAppState } from '../state/core-app.state';
import { BaseResourceService } from './base-resource.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserNote } from '@prisma/client';
import { UserNoteResourceTypeMappings } from '@org/nest/resource';
import { userNoteCompositeKeyOrder } from '@org/nest/resource/objects';

@Injectable()
export class UserNoteService extends BaseResourceService<UserNoteResourceTypeMappings> {
  constructor(
    protected override readonly http: HttpClient,
    protected override readonly store: Store<CoreAppState>
  ) {
    super(http, store, 'user-notes');
  }
}
