import { authFeature } from './auth.reducer';

export const {
  selectAuthState,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
} = authFeature;
