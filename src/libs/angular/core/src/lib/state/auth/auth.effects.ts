import { Actions, createEffect, ofType } from '@ngrx/effects';
import { authActions } from './auth.actions';
import { AuthResponse } from '@org/nest/auth';
import { AuthService } from '../../services/auth.service';
import { CoreAppState } from '../core-app.state';
import { first, map, switchMap, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { selectAuth } from './auth.reducer';
import { Store } from '@ngrx/store';
import { User } from '@prisma/client';

@Injectable()
export class AuthEffects {
  register = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.register),
      switchMap((payload) =>
        this.store
          .select((s) => selectAuth(s))
          .pipe(
            first(),
            switchMap((authState) =>
              this.authService
                .register(
                  payload.email,
                  payload.password,
                  payload.firstName,
                  payload.lastName
                )
                .pipe(
                  map((userAndRefreshToken) =>
                    (userAndRefreshToken as { error: any }).error
                      ? authActions.setError({
                          message: (userAndRefreshToken as { error: any })
                            .error,
                        })
                      : authActions.setUser({
                          user: (userAndRefreshToken as AuthResponse).data.user,
                        })
                  ),
                  tap((r) => {
                    if (
                      r.type == authActions.setUser.type &&
                      authState.originalPath
                    )
                      this.router.navigateByUrl(authState.originalPath);
                  })
                )
            )
          )
      )
    )
  );

  login = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      switchMap((payload) =>
        this.store
          .select((s) => selectAuth(s))
          .pipe(
            first(),
            switchMap((authState) =>
              this.authService.login(payload.email, payload.password).pipe(
                map((userAndRefreshToken) =>
                  (userAndRefreshToken as { error: any }).error
                    ? authActions.setError({
                        message: (userAndRefreshToken as { error: any }).error,
                      })
                    : authActions.setUser({
                        user: (userAndRefreshToken as AuthResponse).data.user,
                      })
                ),
                tap((r) => {
                  if (
                    r.type == authActions.setUser.type &&
                    authState.originalPath
                  )
                    this.router.navigateByUrl(authState.originalPath);
                })
              )
            )
          )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.updateProfile),
      switchMap(
        (payload: {
          firstName?: string;
          lastName?: string;
          email?: string;
          receiveEmailNotifications?: boolean;
        }) =>
          this.store
            .select((s) => selectAuth(s).user?.id)
            .pipe(
              switchMap((id?: number) =>
                this.authService
                  .updateProfile(
                    id!,
                    payload.firstName,
                    payload.lastName,
                    payload.email,
                    payload.receiveEmailNotifications
                  )
                  .pipe(
                    map((res: User | { error: any }) =>
                      (res as { error: any }).error
                        ? authActions.setError({
                            message: (res as { error: any }).error,
                          })
                        : authActions.setUser({
                            user: res as User,
                          })
                    ),
                    tap((action: any) => {
                      if (action.type == authActions.setUser.type) {
                        this.router.navigate(['']);
                      }
                    })
                  )
              )
            )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.updateProfile),
      tap(() => {
        window.location.reload();
      }),
      map(() => ({ type: 'NO OP' } as any))
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly store: Store<CoreAppState>,
    private readonly router: Router
  ) {}
}
