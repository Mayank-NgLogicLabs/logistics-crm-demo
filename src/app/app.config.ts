import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authFeature } from './store/auth/auth.reducer';
import { shipmentsFeature } from './store/shipments/shipments.reducer';
import { customersFeature } from './store/customers/customers.reducer';
import { fleetFeature } from './store/fleet/fleet.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { ShipmentsEffects } from './store/shipments/shipments.effects';
import { CustomersEffects } from './store/customers/customers.effects';
import { FleetEffects } from './store/fleet/fleet.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideStore({
      [authFeature.name]: authFeature.reducer,
      [shipmentsFeature.name]: shipmentsFeature.reducer,
      [customersFeature.name]: customersFeature.reducer,
      [fleetFeature.name]: fleetFeature.reducer,
    }),
    provideEffects([AuthEffects, ShipmentsEffects, CustomersEffects, FleetEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ]
};
