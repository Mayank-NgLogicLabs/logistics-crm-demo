import { createSelector } from '@ngrx/store';
import { shipmentsFeature } from './shipments.reducer';

export const {
  selectShipmentsState,
  selectShipments,
  selectSelectedShipment,
  selectFilter,
  selectIsLoading,
  selectError,
} = shipmentsFeature;

export const selectFilteredShipments = createSelector(
  selectShipments,
  selectFilter,
  (shipments, filter) => {
    let result = [...shipments];
    if (filter.status !== 'all') {
      result = result.filter(s => s.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(s =>
        s.trackingId.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q)
      );
    }
    return result;
  }
);

export const selectPagedShipments = createSelector(
  selectFilteredShipments,
  selectFilter,
  (shipments, filter) => {
    const start = (filter.page - 1) * filter.pageSize;
    return shipments.slice(start, start + filter.pageSize);
  }
);

export const selectTotalFiltered = createSelector(
  selectFilteredShipments,
  shipments => shipments.length
);

export const selectShipmentStats = createSelector(
  selectShipments,
  shipments => ({
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'in_transit').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    delayed: shipments.filter(s => s.status === 'delayed').length,
    pending: shipments.filter(s => s.status === 'pending').length,
    customsHold: shipments.filter(s => s.status === 'customs_hold').length,
  })
);
