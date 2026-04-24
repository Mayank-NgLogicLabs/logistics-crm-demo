import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
    'Restore Session': props<{ user: User }>(),
  }
});
