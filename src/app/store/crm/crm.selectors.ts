import { createSelector } from '@ngrx/store';
import { crmFeature } from './crm.reducer';

export const {
  selectCrmState,
  selectMetrics,
  selectShipments,
  selectCustomers,
  selectAlerts,
  selectWorkflows
} = crmFeature;

export const selectPriorityShipments = createSelector(selectShipments, (shipments) =>
  shipments.filter((shipment) => shipment.priority !== 'Medium')
);
