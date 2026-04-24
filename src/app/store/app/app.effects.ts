import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import * as AppActions from './app.actions';
import { DataService } from '../../core/services/data.service';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private dataService = inject(DataService);

  loadShipments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadShipments),
      exhaustMap(() =>
        this.dataService.getShipments().pipe(
          map((shipments) => AppActions.loadShipmentsSuccess({ shipments })),
          catchError((error) =>
            of(AppActions.loadShipmentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadCustomers),
      exhaustMap(() =>
        this.dataService.getCustomers().pipe(
          map((customers) => AppActions.loadCustomersSuccess({ customers })),
          catchError((error) =>
            of(AppActions.loadCustomersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadOrders),
      exhaustMap(() =>
        this.dataService.getOrders().pipe(
          map((orders) => AppActions.loadOrdersSuccess({ orders })),
          catchError((error) =>
            of(AppActions.loadOrdersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadDashboardStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadDashboardStats),
      exhaustMap(() =>
        this.dataService.getDashboardStats().pipe(
          map((stats) => AppActions.loadDashboardStatsSuccess({ stats }))
        )
      )
    )
  );
}