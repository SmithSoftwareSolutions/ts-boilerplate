import {
  convertAllDatesInObject,
  convertAllDecimalStringsInObject,
  formatQueryParameters,
} from '@org/ts/common';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  catchError,
  endWith,
  filter,
  map,
  Observable,
  switchMap,
  takeWhile,
  throwError,
} from 'rxjs';

import { BaseResourceTypeMappings, PaginatedResponse } from '@org/nest/common';
import { environment } from '../environments/environment';
import { CoreAppState } from '../state/core-app.state';
import { AuthService } from './auth.service';

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export const httpOptions = {
  withCredentials: true,
};

export class BaseResourceService<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>
> {
  constructor(
    protected readonly http: HttpClient,
    protected readonly store: Store<CoreAppState>,
    protected resourceSlug: string,
    protected endpoint?: string,
    protected compositeKeyPropertyOrder?: (keyof ResourceTypeMappings['resourceT'])[],
    protected defaultIncludeForOne: string[] = [],
    protected defaultIncludeForMany: string[] = [],
    protected ignoreForDecimalParsing: string[] = []
  ) {
    if (!endpoint) this.endpoint = environment.resourceService;
  }

  create(data: ResourceTypeMappings['createDTO']) {
    return this.http.post<ResourceTypeMappings['resourceT']>(
      `${this.endpoint}/${this.resourceSlug}`,
      data,
      {
        ...httpOptions,
      }
    );
  }

  update(
    id: ResourceTypeMappings['resourcePrimaryKeyT'],
    data: ResourceTypeMappings['updateDTO']
  ) {
    const idSlug = this.getPrimaryKeyIdSlug(id);
    return this.http.patch<ResourceTypeMappings['resourceT']>(
      `${this.endpoint}/${this.resourceSlug}${idSlug}`,
      data,
      {
        ...httpOptions,
      }
    );
  }

  getOne<T2 = ResourceTypeMappings['resourceWithRelationsT']>(
    id: ResourceTypeMappings['resourcePrimaryKeyT'],
    include?: ResourceTypeMappings['includeT']
  ) {
    const idSlug = this.getPrimaryKeyIdSlug(id);

    const params: Record<string, any> = {};
    if (include) params['include'] = JSON.stringify(include);

    return this.http
      .get<T2>(`${this.endpoint}/${this.resourceSlug}${idSlug}`, {
        ...httpOptions,
        params,
      })
      .pipe(map((res) => this.adjustModel(res)));
  }

  getMany<T2 = ResourceTypeMappings['resourceWithRelationsT']>(
    query?: ResourceTypeMappings['queryDTO']
  ) {
    const params = formatQueryParameters(query, [
      'include',
      'where',
      'orderBy',
      'page',
      'pageSize',
    ]);

    return this.http
      .get<PaginatedResponse<T2>>(`${this.endpoint}/${this.resourceSlug}`, {
        ...httpOptions,
        params,
      })
      .pipe(
        map((res) => {
          const copyOfRes = structuredClone(res);
          copyOfRes.data = copyOfRes.data.map((item) => this.adjustModel(item));
          return copyOfRes;
        })
      );
  }

  delete(id: ResourceTypeMappings['resourcePrimaryKeyT']) {
    const idSlug = this.getPrimaryKeyIdSlug(id);

    return this.http.delete(`${this.endpoint}/${this.resourceSlug}${idSlug}`, {
      ...httpOptions,
    });
  }

  protected getPrimaryKeyIdSlug(
    id: ResourceTypeMappings['resourcePrimaryKeyT']
  ) {
    let idSlug = '';
    if (typeof id == 'number') {
      idSlug = `/${id}`;
    } else if (typeof id == 'object') {
      let idEntries = Object.entries(id);
      if (this.compositeKeyPropertyOrder) {
        idEntries = idEntries.sort(
          ([aKey], [bKey]) =>
            (this.compositeKeyPropertyOrder?.indexOf(aKey) ?? -1) -
            (this.compositeKeyPropertyOrder?.indexOf(bKey) ?? -1)
        );
      }

      idSlug = `/${idEntries.map(([key, value]) => value).join('/')}`;
    }

    return idSlug;
  }

  protected adjustModel: <
    T extends ResourceTypeMappings['resourceWithRelationsT'] = ResourceTypeMappings['resourceWithRelationsT'],
    T2 extends T = T
  >(
    model: T
  ) => T2 = <
    T extends ResourceTypeMappings['resourceWithRelationsT'] = ResourceTypeMappings['resourceWithRelationsT'],
    T2 extends T = T
  >(
    model: T
  ) => {
    const adjustedItem = convertAllDatesInObject(model);
    return convertAllDecimalStringsInObject(
      adjustedItem,
      this.ignoreForDecimalParsing
    );
  };
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store<CoreAppState>
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (
      req.url?.includes('login') ||
      req.url?.includes('refresh') ||
      req.url?.includes('register')
    ) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status == 401) {
          return this.handleRefresh(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handleRefresh(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing$.getValue()) {
      this.isRefreshing$.next(true);
      console.log('Begin refreshing', req.url);

      return this.authService.refresh().pipe(
        switchMap(() => {
          this.isRefreshing$.next(false);
          console.log('Done refreshing', req.url);
          return next.handle(req);
        }),
        catchError((error) => {
          this.isRefreshing$.next(false);
          console.log('Failed to Refresh Token', error);
          return throwError(() => new Error('Failed to Refresh Token'));
        })
      );
    }

    // const done = { doneRefreshing: true };

    console.log('Waiting on diff refreshing', req.url);
    return this.isRefreshing$.pipe(
      filter((is) => !is),
      switchMap(() => {
        console.log('Done waiting', req.url);
        return next.handle(req).pipe(endWith(true));
      }),
      takeWhile((x) => x != true)
    ) as Observable<HttpEvent<any>>;
  }
}

export class UnimplementedError extends Error {
  constructor() {
    super('Method not implemented for class');
  }
}
