import { createFeature, createReducer, on } from '@ngrx/store';
import { Shipment, ShipmentFilter } from '../../core/models/shipment.model';
import { ShipmentsActions } from './shipments.actions';

export interface ShipmentsState {
  shipments: Shipment[];
  selectedShipment: Shipment | null;
  filter: ShipmentFilter;
  isLoading: boolean;
  error: string | null;
}

const initialState: ShipmentsState = {
  shipments: [],
  selectedShipment: null,
  filter: { status: 'all', search: '', page: 1, pageSize: 10 },
  isLoading: false,
  error: null,
};

export const shipmentsFeature = createFeature({
  name: 'shipments',
  reducer: createReducer(
    initialState,
    on(ShipmentsActions.loadShipments, state => ({ ...state, isLoading: true, error: null })),
    on(ShipmentsActions.loadShipmentsSuccess, (state, { shipments }) => ({ ...state, shipments, isLoading: false })),
    on(ShipmentsActions.loadShipmentsFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
    on(ShipmentsActions.selectShipment, (state, { id }) => ({
      ...state, selectedShipment: state.shipments.find(s => s.id === id) ?? null
    })),
    on(ShipmentsActions.clearSelected, state => ({ ...state, selectedShipment: null })),
    on(ShipmentsActions.addShipment, (state, { shipment }) => ({ ...state, shipments: [shipment, ...state.shipments] })),
    on(ShipmentsActions.updateShipment, (state, { shipment }) => ({
      ...state, shipments: state.shipments.map(s => s.id === shipment.id ? shipment : s)
    })),
    on(ShipmentsActions.setFilter, (state, { filter }) => ({
      ...state, filter: { ...state.filter, ...filter, page: 1 }
    })),
  )
});
