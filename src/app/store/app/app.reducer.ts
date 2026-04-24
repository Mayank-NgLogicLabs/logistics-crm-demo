import { createReducer, on } from '@ngrx/store';
import { Shipment, Customer, Order, DashboardStats, Notification } from '../../core/models';
import * as AppActions from './app.actions';

export interface AppState {
  shipments: Shipment[];
  customers: Customer[];
  orders: Order[];
  dashboardStats: DashboardStats | null;
  notifications: Notification[];
  loading: {
    shipments: boolean;
    customers: boolean;
    orders: boolean;
    dashboard: boolean;
  };
  errors: {
    shipments: string | null;
    customers: string | null;
    orders: string | null;
  };
}

export const initialAppState: AppState = {
  shipments: [],
  customers: [],
  orders: [],
  dashboardStats: null,
  notifications: [],
  loading: {
    shipments: false,
    customers: false,
    orders: false,
    dashboard: false
  },
  errors: {
    shipments: null,
    customers: null,
    orders: null
  }
};

export const appReducer = createReducer(
  initialAppState,

  // Shipments
  on(AppActions.loadShipments, (state) => ({
    ...state,
    loading: { ...state.loading, shipments: true }
  })),
  on(AppActions.loadShipmentsSuccess, (state, { shipments }) => ({
    ...state,
    shipments,
    loading: { ...state.loading, shipments: false }
  })),
  on(AppActions.loadShipmentsFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, shipments: false },
    errors: { ...state.errors, shipments: error }
  })),
  on(AppActions.addShipment, (state, { shipment }) => ({
    ...state,
    shipments: [...state.shipments, shipment]
  })),
  on(AppActions.updateShipment, (state, { shipment }) => ({
    ...state,
    shipments: state.shipments.map(s => s.id === shipment.id ? shipment : s)
  })),
  on(AppActions.deleteShipment, (state, { id }) => ({
    ...state,
    shipments: state.shipments.filter(s => s.id !== id)
  })),

  // Customers
  on(AppActions.loadCustomers, (state) => ({
    ...state,
    loading: { ...state.loading, customers: true }
  })),
  on(AppActions.loadCustomersSuccess, (state, { customers }) => ({
    ...state,
    customers,
    loading: { ...state.loading, customers: false }
  })),
  on(AppActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, customers: false },
    errors: { ...state.errors, customers: error }
  })),
  on(AppActions.addCustomer, (state, { customer }) => ({
    ...state,
    customers: [...state.customers, customer]
  })),
  on(AppActions.updateCustomer, (state, { customer }) => ({
    ...state,
    customers: state.customers.map(c => c.id === customer.id ? customer : c)
  })),
  on(AppActions.deleteCustomer, (state, { id }) => ({
    ...state,
    customers: state.customers.filter(c => c.id !== id)
  })),

  // Orders
  on(AppActions.loadOrders, (state) => ({
    ...state,
    loading: { ...state.loading, orders: true }
  })),
  on(AppActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: { ...state.loading, orders: false }
  })),
  on(AppActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, orders: false },
    errors: { ...state.errors, orders: error }
  })),
  on(AppActions.addOrder, (state, { order }) => ({
    ...state,
    orders: [...state.orders, order]
  })),
  on(AppActions.updateOrder, (state, { order }) => ({
    ...state,
    orders: state.orders.map(o => o.id === order.id ? order : o)
  })),

  // Dashboard
  on(AppActions.loadDashboardStats, (state) => ({
    ...state,
    loading: { ...state.loading, dashboard: true }
  })),
  on(AppActions.loadDashboardStatsSuccess, (state, { stats }) => ({
    ...state,
    dashboardStats: stats,
    loading: { ...state.loading, dashboard: false }
  })),

  // Notifications
  on(AppActions.addNotification, (state, { notification }) => ({
    ...state,
    notifications: [notification, ...state.notifications]
  })),
  on(AppActions.markNotificationRead, (state, { id }) => ({
    ...state,
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),
  on(AppActions.clearNotifications, (state) => ({
    ...state,
    notifications: []
  }))
);