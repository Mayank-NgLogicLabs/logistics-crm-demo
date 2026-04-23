import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { UserSession } from '../../core/models/crm.models';
import { writeSession } from '../../core/storage/session.storage';
import { authActions } from './auth.actions';

export const authEffects = {
  login$: createEffect(
    (actions$ = inject(Actions)) =>
      actions$.pipe(
        ofType(authActions.login),
        map(({ email }): UserSession => ({
          name: email.includes('manager') ? 'Maya Sharma' : 'Arjun Rao',
          email,
          role: email.includes('manager') ? 'Regional Manager' : 'Operations Lead'
        })),
        map((session) => authActions.loginSuccess({ session }))
      ),
    { functional: true }
  ),
  persistLogin$: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
      actions$.pipe(
        ofType(authActions.loginSuccess),
        tap(({ session }) => {
          writeSession(session);
          void router.navigateByUrl('/dashboard');
        })
      ),
    { functional: true, dispatch: false }
  ),
  logout$: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
      actions$.pipe(
        ofType(authActions.logout),
        tap(() => {
          writeSession(null);
          void router.navigateByUrl('/login');
        })
      ),
    { functional: true, dispatch: false }
  )
};
