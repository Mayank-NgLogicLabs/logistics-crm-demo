import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.login),
    switchMap(({ email, password }) =>
      this.authService.login(email, password).pipe(
        map(user => AuthActions.loginSuccess({ user })),
        catchError(err => of(AuthActions.loginFailure({ error: err.message })))
      )
    )
  ));

  loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginSuccess),
    tap(() => this.router.navigate(['/dashboard']))
  ), { dispatch: false });

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => {
      this.authService.logout().subscribe();
      this.router.navigate(['/login']);
    })
  ), { dispatch: false });
}
