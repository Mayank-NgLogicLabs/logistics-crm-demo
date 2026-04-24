import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Shipment, ShipmentFilter } from '../../core/models/shipment.model';

export const ShipmentsActions = createActionGroup({
  source: 'Shipments',
  events: {
    'Load Shipments': emptyProps(),
    'Load Shipments Success': props<{ shipments: Shipment[] }>(),
    'Load Shipments Failure': props<{ error: string }>(),
    'Select Shipment': props<{ id: string }>(),
    'Clear Selected': emptyProps(),
    'Add Shipment': props<{ shipment: Shipment }>(),
    'Update Shipment': props<{ shipment: Shipment }>(),
    'Set Filter': props<{ filter: Partial<ShipmentFilter> }>(),
  }
});
