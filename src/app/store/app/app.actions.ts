import { createAction, props } from '@ngrx/store';
import { Shipment, Customer, Order, DashboardStats, Notification } from '../../core/models';

// Shipments Actions
export const loadShipments = createAction('[Shipments] Load');
export const loadShipmentsSuccess = createAction(
  '[Shipments] Load Success',
  props<{ shipments: Shipment[] }>()
);
export const loadShipmentsFailure = createAction(
  '[Shipments] Load Failure',
  props<{ error: string }>()
);
export const addShipment = createAction(
  '[Shipments] Add',
  props<{ shipment: Shipment }>()
);
export const updateShipment = createAction(
  '[Shipments] Update',
  props<{ shipment: Shipment }>()
);
export const deleteShipment = createAction(
  '[Shipments] Delete',
  props<{ id: string }>()
);

// Customers Actions
export const loadCustomers = createAction('[Customers] Load');
export const loadCustomersSuccess = createAction(
  '[Customers] Load Success',
  props<{ customers: Customer[] }>()
);
export const loadCustomersFailure = createAction(
  '[Customers] Load Failure',
  props<{ error: string }>()
);
export const addCustomer = createAction(
  '[Customers] Add',
  props<{ customer: Customer }>()
);
export const updateCustomer = createAction(
  '[Customers] Update',
  props<{ customer: Customer }>()
);
export const deleteCustomer = createAction(
  '[Customers] Delete',
  props<{ id: string }>()
);

// Orders Actions
export const loadOrders = createAction('[Orders] Load');
export const loadOrdersSuccess = createAction(
  '[Orders] Load Success',
  props<{ orders: Order[] }>()
);
export const loadOrdersFailure = createAction(
  '[Orders] Load Failure',
  props<{ error: string }>()
);
export const addOrder = createAction(
  '[Orders] Add',
  props<{ order: Order }>()
);
export const updateOrder = createAction(
  '[Orders] Update',
  props<{ order: Order }>()
);

// Dashboard Actions
export const loadDashboardStats = createAction('[Dashboard] Load Stats');
export const loadDashboardStatsSuccess = createAction(
  '[Dashboard] Load Stats Success',
  props<{ stats: DashboardStats }>()
);

// Notifications Actions
export const addNotification = createAction(
  '[Notifications] Add',
  props<{ notification: Notification }>()
);
export const markNotificationRead = createAction(
  '[Notifications] Mark Read',
  props<{ id: string }>()
);
export const clearNotifications = createAction('[Notifications] Clear');