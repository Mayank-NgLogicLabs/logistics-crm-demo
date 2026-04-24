import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'shipments', loadComponent: () => import('./features/shipments/shipments-list/shipments-list.component').then(m => m.ShipmentsListComponent) },
      { path: 'shipments/:id', loadComponent: () => import('./features/shipments/shipment-detail/shipment-detail.component').then(m => m.ShipmentDetailComponent) },
      { path: 'customers', loadComponent: () => import('./features/customers/customers-list/customers-list.component').then(m => m.CustomersListComponent) },
      { path: 'customers/:id', loadComponent: () => import('./features/customers/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent) },
      { path: 'fleet', loadComponent: () => import('./features/fleet/fleet.component').then(m => m.FleetComponent) },
      { path: 'reports', loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
