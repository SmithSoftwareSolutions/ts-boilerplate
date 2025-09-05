import { AuthResponse } from '@org/nest/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '@prisma/client';
import {
  catchError,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../environments/environment';
import { authActions } from '../state/auth/auth.actions';
import { AuthState, selectAuth } from '../state/auth/auth.reducer';
import { CoreAppState } from '../state/core-app.state';

const httpOptions = {
  withCredentials: true,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private store: Store<CoreAppState>
  ) {}

  login(
    email: string,
    password: string
  ): Observable<AuthResponse | { error: any }> {
    return this.http
      .post<AuthResponse>(
        `${environment.authService}/login`,
        {
          email,
          password,
        },
        httpOptions
      )
      .pipe(
        catchError((res) =>
          of({
            error: res.error?.message,
          })
        )
      );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<AuthResponse | { error: any }> {
    return this.http
      .post<AuthResponse>(
        `${environment.authService}/register`,
        {
          email,
          password,
          firstName,
          lastName,
        },
        httpOptions
      )
      .pipe(
        catchError((res) =>
          of({
            error: res.error?.message,
          })
        )
      );
  }

  refresh() {
    return this.store.select(selectAuth).pipe(
      take(1),
      switchMap((authState: AuthState) =>
        authState.user
          ? this.http.post<AuthResponse>(
              `${environment.authService}/refresh`,
              {},
              httpOptions
            )
          : of(null)
      ),
      tap((res) => {
        if (res)
          this.store.dispatch(
            authActions.setUser({
              user: res.data.user,
            })
          );
      }),
      // delay(1000),
      catchError((err) => {
        console.log('Error refreshing auth', err);
        this.store.dispatch(authActions.logout());

        return throwError(() => err);
      })
    );
  }

  updateProfile(
    id: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    receiveEmailNotifications?: boolean
  ): Observable<User | { error: any }> {
    return this.http
      .patch<User>(
        `${environment.authService}/profile/${id}`,
        {
          firstName,
          lastName,
          email,
          receiveEmailNotifications,
        },
        httpOptions
      )
      .pipe(
        catchError((res) =>
          of({
            error: res.error?.message,
          })
        )
      );
  }

  requestResetPassword(email: string) {
    return this.http.post(
      `${environment.authService}/request-reset-password`,
      {
        email,
      },
      { ...httpOptions }
    );
  }

  resetPassword(userId: number, newPassword: string, token: string) {
    return this.http.post(
      `${environment.authService}/reset-password`,
      {
        userId,
        token,
        newPassword,
      },
      { ...httpOptions }
    );
  }
}
