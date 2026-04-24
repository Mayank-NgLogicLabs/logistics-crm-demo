import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Vehicle } from '../../core/models/fleet.model';

export const FleetActions = createActionGroup({
  source: 'Fleet',
  events: {
    'Load Fleet': emptyProps(),
    'Load Fleet Success': props<{ vehicles: Vehicle[] }>(),
    'Load Fleet Failure': props<{ error: string }>(),
    'Select Vehicle': props<{ id: string }>(),
    'Clear Selected': emptyProps(),
    'Update Vehicle Status': props<{ id: string; status: Vehicle['status'] }>(),
  }
});
