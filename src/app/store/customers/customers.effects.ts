import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MockDataService } from '../../core/services/mock-data.service';
import { CustomersActions } from './customers.actions';

@Injectable()
export class CustomersEffects {
  private actions$ = inject(Actions);
  private dataService = inject(MockDataService);

  loadCustomers$ = createEffect(() => this.actions$.pipe(
    ofType(CustomersActions.loadCustomers),
    switchMap(() =>
      this.dataService.getCustomers().pipe(
        map(customers => CustomersActions.loadCustomersSuccess({ customers })),
        catchError(err => of(CustomersActions.loadCustomersFailure({ error: err.message })))
      )
    )
  ));
}
