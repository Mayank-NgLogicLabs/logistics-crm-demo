import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserSession } from '../../core/models/crm.models';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ email: string; password: string }>(),
    LoginSuccess: props<{ session: UserSession }>(),
    Logout: emptyProps()
  }
});
