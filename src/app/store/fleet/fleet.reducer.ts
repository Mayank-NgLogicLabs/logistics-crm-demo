import { createFeature, createReducer, on } from '@ngrx/store';
import { Vehicle } from '../../core/models/fleet.model';
import { FleetActions } from './fleet.actions';

export interface FleetState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FleetState = {
  vehicles: [],
  selectedVehicle: null,
  isLoading: false,
  error: null,
};

export const fleetFeature = createFeature({
  name: 'fleet',
  reducer: createReducer(
    initialState,
    on(FleetActions.loadFleet, state => ({ ...state, isLoading: true, error: null })),
    on(FleetActions.loadFleetSuccess, (state, { vehicles }) => ({ ...state, vehicles, isLoading: false })),
    on(FleetActions.loadFleetFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
    on(FleetActions.selectVehicle, (state, { id }) => ({
      ...state, selectedVehicle: state.vehicles.find(v => v.id === id) ?? null
    })),
    on(FleetActions.clearSelected, state => ({ ...state, selectedVehicle: null })),
    on(FleetActions.updateVehicleStatus, (state, { id, status }) => ({
      ...state, vehicles: state.vehicles.map(v => v.id === id ? { ...v, status } : v)
    })),
  )
});
