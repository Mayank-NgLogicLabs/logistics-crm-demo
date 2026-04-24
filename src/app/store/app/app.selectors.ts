import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app.reducer';
import { OrderStatus } from '../../core/models';

export const selectAppState = createFeatureSelector<AppState>('app');

// Shipments Selectors
export const selectShipments = createSelector(
  selectAppState,
  (state) => state.shipments
);

export const selectShipmentsLoading = createSelector(
  selectAppState,
  (state) => state.loading.shipments
);

export const selectShipmentsError = createSelector(
  selectAppState,
  (state) => state.errors.shipments
);

export const selectPendingShipments = createSelector(
  selectShipments,
  (shipments) => shipments.filter(s => s.status === 'pending')
);

export const selectInTransitShipments = createSelector(
  selectShipments,
  (shipments) => shipments.filter(s => s.status === 'in_transit')
);

export const selectDeliveredShipments = createSelector(
  selectShipments,
  (shipments) => shipments.filter(s => s.status === 'delivered')
);

// Customers Selectors
export const selectCustomers = createSelector(
  selectAppState,
  (state) => state.customers
);

export const selectCustomersLoading = createSelector(
  selectAppState,
  (state) => state.loading.customers
);

export const selectActiveCustomers = createSelector(
  selectCustomers,
  (customers) => customers.filter(c => c.status === 'active')
);

// Orders Selectors
export const selectOrders = createSelector(
  selectAppState,
  (state) => state.orders
);

export const selectOrdersLoading = createSelector(
  selectAppState,
  (state) => state.loading.orders
);

export const selectPendingOrders = createSelector(
  selectOrders,
  (orders) => orders.filter(o => o.status === OrderStatus.DRAFT || o.status === OrderStatus.CONFIRMED)
);

// Dashboard Selectors
export const selectDashboardStats = createSelector(
  selectAppState,
  (state) => state.dashboardStats
);

export const selectDashboardLoading = createSelector(
  selectAppState,
  (state) => state.loading.dashboard
);

// Notifications Selectors
export const selectNotifications = createSelector(
  selectAppState,
  (state) => state.notifications
);

export const selectUnreadNotifications = createSelector(
  selectNotifications,
  (notifications) => notifications.filter(n => !n.read)
);

export const selectUnreadCount = createSelector(
  selectUnreadNotifications,
  (notifications) => notifications.length
);