import { createFeature, createReducer, on } from '@ngrx/store';
import { UserSession } from '../../core/models/crm.models';
import { readSession } from '../../core/storage/session.storage';
import { authActions } from './auth.actions';

export interface AuthState {
  session: UserSession | null;
  isAuthenticated: boolean;
}

const initialSession = readSession();

const initialState: AuthState = {
  session: initialSession,
  isAuthenticated: !!initialSession
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(authActions.loginSuccess, (state, { session }) => ({
      ...state,
      session,
      isAuthenticated: true
    })),
    on(authActions.logout, () => ({
      session: null,
      isAuthenticated: false
    }))
  )
});
