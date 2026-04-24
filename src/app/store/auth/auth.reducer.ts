import { createFeature, createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user.model';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.login, state => ({ ...state, isLoading: true, error: null })),
    on(AuthActions.loginSuccess, (state, { user }) => ({ ...state, user, isAuthenticated: true, isLoading: false })),
    on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
    on(AuthActions.logout, () => initialState),
    on(AuthActions.restoreSession, (state, { user }) => ({ ...state, user, isAuthenticated: true })),
  )
});
