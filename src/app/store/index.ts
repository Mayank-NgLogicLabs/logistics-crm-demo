export * from './auth/auth.actions';
export * from './auth/auth.reducer';
export * from './auth/auth.selectors';
export * from './auth/auth.effects';
export * from './app/app.actions';
export * from './app/app.reducer';
export * from './app/app.selectors';
export * from './app/app.effects';

import { authReducer } from './auth/auth.reducer';
import { AppState, appReducer } from './app/app.reducer';
import { AuthEffects } from './auth/auth.effects';
import { AppEffects } from './app/app.effects';
import { AuthState } from '../core/models';

export const reducers = {
  auth: authReducer,
  app: appReducer
};

export const effects = [AuthEffects, AppEffects];

export interface State {
  auth: AuthState;
  app: AppState;
}