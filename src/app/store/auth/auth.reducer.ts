import { createReducer, on } from '@ngrx/store';
import { AuthState, User } from '../../core/models';
import * as AuthActions from './auth.actions';

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,
  
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true
  })),
  
  on(AuthActions.logoutSuccess, () => ({
    ...initialAuthState
  })),
  
  // Set Auth State (for restoring from localStorage)
  on(AuthActions.setAuthState, (state, { state: newState }) => ({
    ...state,
    ...newState,
    isLoading: false
  })),
  
  // Clear Error
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null
  }))
);