import { authFeature } from './auth.reducer';

export const {
  selectAuthState,
  selectIsAuthenticated,
  selectSession
} = authFeature;
