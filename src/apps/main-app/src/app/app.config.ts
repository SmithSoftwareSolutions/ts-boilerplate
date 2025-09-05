import { angularCoreServices, AuthInterceptor } from '@org/angular/core';
import {
  mainAppEffects,
  mainAppMetaReducers,
  mainAppReducers,
} from '@org/angular/main';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { FormlyModule } from '@ngx-formly/core';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    ...angularCoreServices,
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideStore(mainAppReducers, {
      metaReducers: mainAppMetaReducers,
    }),
    provideEffects(...mainAppEffects),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    importProvidersFrom(
      FormlyModule.forRoot({
        types: [],
        validationMessages: [
          {
            name: 'required',
            message: 'This field is required.',
          },
          {
            name: 'email',
            message: 'Must be a valid email',
          },
          {
            name: 'min-password',
            message:
              'Must be at least 6 characters long and have at least 1 special character',
          },
          {
            name: 'confirm-password',
            message: 'Must match password',
          },
        ],
        validators: [
          {
            name: 'existing-resource',
            validation: (fieldControl) =>
              typeof fieldControl.value == 'object' && fieldControl.value.id,
          },
          {
            name: 'min-password',
            validation: (fieldControl) => {
              const newPassword = fieldControl.value;
              const specialCharacterRegex = new RegExp(/[^A-Za-z0-9]/g);
              return (
                newPassword &&
                newPassword.length > 5 &&
                specialCharacterRegex.test(newPassword)
              );
            },
          },
        ],
      })
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
