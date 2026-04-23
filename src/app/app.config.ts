import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authEffects } from './store/auth/auth.effects';
import { authFeature } from './store/auth/auth.reducer';
import { crmFeature } from './store/crm/crm.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      [authFeature.name]: authFeature.reducer,
      [crmFeature.name]: crmFeature.reducer
    }),
    provideEffects(authEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    })
  ]
};
