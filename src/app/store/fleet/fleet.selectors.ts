import { createSelector } from '@ngrx/store';
import { fleetFeature } from './fleet.reducer';

export const {
  selectFleetState,
  selectVehicles,
  selectSelectedVehicle,
  selectIsLoading,
  selectError,
} = fleetFeature;

export const selectFleetStats = createSelector(
  selectVehicles,
  vehicles => ({
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'active').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    idle: vehicles.filter(v => v.status === 'idle').length,
  })
);
