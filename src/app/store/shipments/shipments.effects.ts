import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MockDataService } from '../../core/services/mock-data.service';
import { ShipmentsActions } from './shipments.actions';

@Injectable()
export class ShipmentsEffects {
  private actions$ = inject(Actions);
  private dataService = inject(MockDataService);

  loadShipments$ = createEffect(() => this.actions$.pipe(
    ofType(ShipmentsActions.loadShipments),
    switchMap(() =>
      this.dataService.getShipments().pipe(
        map(shipments => ShipmentsActions.loadShipmentsSuccess({ shipments })),
        catchError(err => of(ShipmentsActions.loadShipmentsFailure({ error: err.message })))
      )
    )
  ));
}
