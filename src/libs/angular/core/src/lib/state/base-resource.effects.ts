import { ActionCreator, createAction, Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BaseResourceActions } from './create-base-resource-actions';
import { BaseResourceService } from '../services/base-resource.service';
import { BaseResourceState } from './create-base-resource-reducer';
import { BaseResourceTypeMappings, PaginatedResponse } from '@org/nest/common';
import {
  catchError,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { CoreAppState } from './core-app.state';
import { Flatten } from '@org/ts/common';
export const NoAction = createAction('NO_ACTION');

export class BaseResourceEffects<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>,
  ServiceT extends BaseResourceService<ResourceTypeMappings> = BaseResourceService<ResourceTypeMappings>,
  ActionT extends BaseResourceActions<ResourceTypeMappings> = BaseResourceActions<ResourceTypeMappings>,
  StateT extends BaseResourceState<ResourceTypeMappings> = BaseResourceState<ResourceTypeMappings>
> {
  createItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.itemActions.createItem),
      mergeMap((payload) =>
        this.service.create(payload.data).pipe(
          map((res) =>
            payload.andLoadToCurrent
              ? this.itemActions.loadItem({
                  id: res.id,
                  include: payload.loadToCurrentInclude ?? {},
                })
              : this.itemActions.creationSuccessful()
          ),
          catchError((err) =>
            of(
              this.itemActions.setError({
                error:
                  err.error?.message?.toString() ??
                  err.message?.toString() ??
                  err.toString(),
              })
            )
          )
        )
      )
    )
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.itemActions.updateItem),
      mergeMap((payload) =>
        this.service.update(payload.id, payload.data).pipe(
          map(() => this.itemActions.updateSuccessful()),
          catchError((err) =>
            of(
              this.itemActions.setError({
                error:
                  err.error?.message?.toString() ??
                  err.message?.toString() ??
                  err.toString(),
              })
            )
          )
        )
      )
    )
  );

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.itemActions.loadItems),
      switchMap((payload) => {
        const query = { ...payload.query };
        if (payload['type']) {
          delete query['type'];
        }
        return this.service.getMany(query).pipe(
          map((res: PaginatedResponse<ResourceTypeMappings['resourceT']>) =>
            this.itemActions.setItems({
              items: res.data,
              page: res.metadata?.page,
              itemCount: res.metadata.total,
            })
          ),
          catchError((err) =>
            of(
              this.itemActions.setError({
                error:
                  err.error?.message?.toString() ??
                  err.message?.toString() ??
                  err.toString(),
              })
            )
          )
        );
      })
    )
  );

  reloadCurrentItem = createEffect(() =>
    this.actions$.pipe(
      ofType(this.itemActions.updateSuccessful),
      switchMap(() =>
        this.store
          .select((s) => this.stateSelector(s).current)
          .pipe(
            take(1),
            map((current) =>
              current ? this.itemActions.refreshItem() : NoAction()
            )
          )
      )
    )
  );

  reloadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        this.itemActions.creationSuccessful,
        this.itemActions.updateSuccessful,
        this.itemActions.deletionSuccessful,
        ...this.additionalLoadActions
      ),
      switchMap(() => {
        return this.store
          .select((s) => this.stateSelector(s).currentQuery)
          .pipe(
            take(1),
            switchMap((currentQuery) => {
              const query = { ...currentQuery };
              return this.service.getMany(query as any).pipe(
                map(
                  (res: PaginatedResponse<ResourceTypeMappings['resourceT']>) =>
                    this.itemActions.setItems({
                      items: res.data,
                      page: res.metadata?.page,
                    })
                ),
                catchError((err) =>
                  of(
                    this.itemActions.setError({
                      error:
                        err.error?.message?.toString() ??
                        err.message?.toString() ??
                        err.toString(),
                    })
                  )
                )
              );
            })
          );
      })
    )
  );

  loadItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.itemActions.loadItem, this.itemActions.refreshItem),
      switchMap(
        (payload: {
          id: ResourceTypeMappings['resourcePrimaryKeyT'];
          include?: ResourceTypeMappings['includeT'];
        }) =>
          this.store.select(this.stateSelector).pipe(
            take(1),
            switchMap((state) =>
              payload.id || state.current?.id
                ? this.service
                    .getOne(
                      +(payload.id ?? +state.current?.id),
                      payload.id ? payload.include : state.currentItemIncludes
                    )
                    .pipe(
                      map((res) =>
                        this.itemActions.setCurrent({
                          item: res,
                        })
                      ),
                      catchError((err) =>
                        of(
                          this.itemActions.setError({
                            error:
                              err.error?.message?.toString() ??
                              err.message?.toString() ??
                              err.toString(),
                          })
                        )
                      )
                    )
                : of(NoAction())
            )
          )
      )
    )
  );

  deleteItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.itemActions.deleteItem),
      mergeMap((payload) =>
        this.service.delete(payload.id).pipe(
          map((res) => this.itemActions.deletionSuccessful()),
          catchError((err) => {
            console.log(err);
            return of(
              this.itemActions.setError({
                error:
                  err.error?.message?.toString() ??
                  err.message?.toString() ??
                  err.toString(),
              })
            );
          })
        )
      )
    )
  );

  // showError$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(this.itemActions.setError),
  //     tap((v) => console.log('ISSUE', v)),
  //     mergeMap((payload) =>
  //       of(
  //         addMessageToSnackbarQueue({
  //           message: payload.error?.message ?? payload.error,
  //           messageType: MESSAGE_QUEUE_DISPLAY_TYPE.ERROR,
  //         })
  //       )
  //     )
  //   )
  // );

  constructor(
    protected readonly actions$: Actions,
    protected readonly store: Store<CoreAppState>,
    protected readonly service: ServiceT,
    protected itemActions: ActionT,
    protected stateSelector: (s: CoreAppState) => StateT,
    protected readonly additionalLoadActions: ActionCreator[] = []
  ) {}
}

export const buildLinkageHandlerEffect = <
  ResourceTypeMappings extends BaseResourceTypeMappings<any>,
  LinkageResourceTypeMappings extends BaseResourceTypeMappings<any>,
  ServiceT extends BaseResourceService<ResourceTypeMappings>,
  LinkageServiceT extends BaseResourceService<LinkageResourceTypeMappings>,
  PayloadT extends { linkages: any[] } = any
>(
  idName: keyof LinkageResourceTypeMappings['resourceT'],
  linkedIdName: keyof LinkageResourceTypeMappings['resourceT'],
  service: ServiceT,
  linkageService: LinkageServiceT,
  payload: PayloadT,
  linkageProperties: (keyof Flatten<PayloadT['linkages']>)[] = [],
  resourceProperties: (keyof Flatten<PayloadT['linkages']>)[] = [],
  noCreate = resourceProperties?.length < 1
) => {
  // get existing linkages
  const obs = linkageService
    .getMany({
      where: {
        [linkedIdName]: payload[linkedIdName],
      },
    })
    .pipe(
      switchMap((existingLinkages) => {
        const observables = [];

        for (const existingLinkage of existingLinkages.data) {
          const updatedLinkage = payload.linkages.find(
            (li: Flatten<PayloadT['linkages']>) =>
              li[idName] == existingLinkage[idName]
          );
          if (updatedLinkage) {
            // update
            console.log('UPDATE', updatedLinkage);
            observables.push(
              linkageService
                .update(
                  {
                    [idName]: existingLinkage[idName],
                    [linkedIdName]: payload[linkedIdName],
                  },
                  {
                    ...linkageProperties.reduce((obj, value) => {
                      obj[value as string] = updatedLinkage[value];
                      return obj;
                    }, {} as Record<string, any>),
                  }
                )
                .pipe(
                  switchMap(() =>
                    resourceProperties?.length > 0
                      ? service.update(updatedLinkage[idName], {
                          ...resourceProperties.reduce((obj, value) => {
                            obj[value as string] = updatedLinkage[value];
                            return obj;
                          }, {} as Record<string, any>),
                        })
                      : of(null)
                  )
                )
            );
          } else {
            console.log('DELETE', existingLinkage);
            // delete linkage
            observables.push(
              linkageService.delete({
                [idName]: existingLinkage[idName],
                [linkedIdName]: payload[linkedIdName],
              })
            );
          }
        }

        for (const linkage of payload.linkages) {
          if (
            !existingLinkages.data?.find(
              (el: any) => el[idName] == linkage[idName]
            )
          ) {
            let obs:
              | Observable<{
                  id: ResourceTypeMappings['resourcePrimaryKeyT'];
                }>
              | undefined;
            if (linkage[idName]) {
              // link
              obs = of({ id: linkage[idName] });
            } else {
              if (!noCreate) {
                console.log('CREATE', linkage);
                // create
                obs = service.create({
                  ...resourceProperties.reduce((obj, value) => {
                    obj[value as string] = linkage[value];
                    return obj;
                  }, {} as Record<string, any>),
                });
              }
            }
            if (obs)
              observables.push(
                obs.pipe(
                  switchMap((res) =>
                    linkageService.create({
                      [idName]: res.id,
                      [linkedIdName]: payload[linkedIdName],
                      ...linkageProperties.reduce((obj, value) => {
                        obj[value as string] = linkage[value];
                        return obj;
                      }, {} as Record<string, any>),
                    })
                  )
                )
              );
          }
        }
        return forkJoin(observables);
      })
    );

  return obs;
};
