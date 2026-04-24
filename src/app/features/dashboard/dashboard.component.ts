import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AppActions from '../../store/app/app.actions';
import { 
  selectDashboardStats, 
  selectDashboardLoading,
  selectShipments,
  selectCustomers,
  selectOrders
} from '../../store/app/app.selectors';
import { selectUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="welcome-section">
          <h1>Welcome back, {{ userName() }}! 👋</h1>
          <p>Here's what's happening with your logistics today.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" routerLink="/shipments/new">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Shipment
          </button>
        </div>
      </header>

      @if (isLoading()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
        </div>
      } @else {
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon shipments">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Total Shipments</span>
              <span class="stat-value">{{ stats()?.totalShipments || 0 }}</span>
              <span class="stat-change positive">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                +12.5%
              </span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon pending">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Pending</span>
              <span class="stat-value">{{ stats()?.pendingShipments || 0 }}</span>
              <span class="stat-subtitle">Awaiting pickup</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon transit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">In Transit</span>
              <span class="stat-value">{{ stats()?.inTransitShipments || 0 }}</span>
              <span class="stat-subtitle">On the way</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon delivered">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Delivered</span>
              <span class="stat-value">{{ stats()?.deliveredShipments || 0 }}</span>
              <span class="stat-subtitle">This month</span>
            </div>
          </div>
        </div>

        <!-- Charts and Tables Row -->
        <div class="content-grid">
          <!-- Recent Shipments -->
          <div class="content-card">
            <div class="card-header">
              <h3>Recent Shipments</h3>
              <a routerLink="/shipments" class="view-all">View All →</a>
            </div>
            <div class="shipments-table">
              <table>
                <thead>
                  <tr>
                    <th>Tracking #</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  @for (shipment of recentShipments(); track shipment.id) {
                    <tr>
                      <td class="tracking">{{ shipment.trackingNumber }}</td>
                      <td>{{ shipment.customerName }}</td>
                      <td>
                        <span class="status-badge" [attr.data-status]="shipment.status">
                          {{ formatStatus(shipment.status) }}
                        </span>
                      </td>
                      <td>
                        <span class="priority-badge" [attr.data-priority]="shipment.priority">
                          {{ shipment.priority }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="content-card">
            <div class="card-header">
              <h3>Quick Stats</h3>
            </div>
            <div class="quick-stats">
              <div class="quick-stat-item">
                <div class="quick-stat-info">
                  <span class="quick-stat-label">Active Customers</span>
                  <span class="quick-stat-value">{{ stats()?.activeCustomers || 0 }}</span>
                </div>
                <div class="quick-stat-bar">
                  <div class="bar-fill" [style.width.%]="getCustomerPercentage()"></div>
                </div>
              </div>
              <div class="quick-stat-item">
                <div class="quick-stat-info">
                  <span class="quick-stat-label">Total Revenue</span>
                  <span class="quick-stat-value">{{ stats()?.totalRevenue | currency }}</span>
                </div>
                <div class="quick-stat-bar">
                  <div class="bar-fill revenue" [style.width.%]="75"></div>
                </div>
              </div>
              <div class="quick-stat-item">
                <div class="quick-stat-info">
                  <span class="quick-stat-label">Monthly Growth</span>
                  <span class="quick-stat-value positive">+{{ stats()?.monthlyGrowth || 0 }}%</span>
                </div>
                <div class="quick-stat-bar">
                  <div class="bar-fill growth" [style.width.%]="stats()?.monthlyGrowth * 5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Cards Row -->
        <div class="actions-grid">
          <div class="action-card" routerLink="/customers">
            <div class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h4>Customers</h4>
            <p>Manage your customer database</p>
            <span class="action-count">{{ customers().length }} total</span>
          </div>

          <div class="action-card" routerLink="/orders">
            <div class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h4>Orders</h4>
            <p>View and manage orders</p>
            <span class="action-count">{{ orders().length }} total</span>
          </div>

          <div class="action-card" routerLink="/shipments">
            <div class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <h4>Shipments</h4>
            <p>Track all shipments</p>
            <span class="action-count">{{ shipments().length }} total</span>
          </div>

          <div class="action-card" routerLink="/reports">
            <div class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h4>Reports</h4>
            <p>View analytics & reports</p>
            <span class="action-count">View Analytics</span>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);

  // NgRx selectors as signals
  stats = this.store.selectSignal(selectDashboardStats);
  isLoading = this.store.selectSignal(selectDashboardLoading);
  shipments = this.store.selectSignal(selectShipments);
  customers = this.store.selectSignal(selectCustomers);
  orders = this.store.selectSignal(selectOrders);
  user = this.store.selectSignal(selectUser);

  // Computed values
  userName = computed(() => this.user()?.firstName || 'User');
  
  recentShipments = computed(() => 
    this.shipments().slice(0, 5)
  );

  ngOnInit(): void {
    this.store.dispatch(AppActions.loadDashboardStats());
    this.store.dispatch(AppActions.loadShipments());
    this.store.dispatch(AppActions.loadCustomers());
    this.store.dispatch(AppActions.loadOrders());
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getCustomerPercentage(): number {
    const stats = this.stats();
    if (!stats) return 0;
    return (stats.activeCustomers / stats.totalCustomers) * 100;
  }
}