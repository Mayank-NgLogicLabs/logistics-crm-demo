import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MockDataService } from '../../core/services/mock-data.service';
import { FleetActions } from './fleet.actions';

@Injectable()
export class FleetEffects {
  private actions$ = inject(Actions);
  private dataService = inject(MockDataService);

  loadFleet$ = createEffect(() => this.actions$.pipe(
    ofType(FleetActions.loadFleet),
    switchMap(() =>
      this.dataService.getVehicles().pipe(
        map(vehicles => FleetActions.loadFleetSuccess({ vehicles })),
        catchError(err => of(FleetActions.loadFleetFailure({ error: err.message })))
      )
    )
  ));
}
