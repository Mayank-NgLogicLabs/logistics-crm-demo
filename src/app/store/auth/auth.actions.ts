import { createAction, props } from '@ngrx/store';
import { User, LoginCredentials, AuthState } from '../../core/models';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Session Actions
export const checkAuthStatus = createAction('[Auth] Check Auth Status');

export const setAuthState = createAction(
  '[Auth] Set Auth State',
  props<{ state: Partial<AuthState> }>()
);

export const clearAuthError = createAction('[Auth] Clear Error');