import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../core/models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role
);

export const selectUserFullName = createSelector(
  selectUser,
  (user) => user ? `${user.firstName} ${user.lastName}` : ''
);