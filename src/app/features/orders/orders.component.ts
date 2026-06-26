import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AppActions from '../../store/app/app.actions';
import { 
  selectOrders, 
  selectOrdersLoading 
} from '../../store/app/app.selectors';
import { Order, OrderStatus } from '../../core/models';

@Component({
    selector: 'app-orders',
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="orders-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Orders</h1>
          <p>Manage and track customer orders</p>
        </div>
        <button class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Order
        </button>
      </header>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ orders().length }}</span>
            <span class="stat-label">Total Orders</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ pendingOrders().length }}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon revenue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalRevenue() | currency }}</span>
            <span class="stat-label">Total Revenue</span>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="orders-table-wrapper">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Shipments</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (order of orders(); track order.id) {
              <tr>
                <td class="order-number">{{ order.orderNumber }}</td>
                <td>{{ order.customerName }}</td>
                <td>
                  <span class="status-badge" [attr.data-status]="order.status">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td>
                  <span class="payment-badge" [attr.data-payment]="order.paymentStatus">
                    {{ formatPayment(order.paymentStatus) }}
                  </span>
                </td>
                <td class="amount">{{ order.totalAmount | currency }}</td>
                <td>
                  <span class="shipments-count">{{ order.shipments.length }}</span>
                </td>
                <td class="date">{{ order.createdAt | date:'MMM d, y' }}</td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn" title="View">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button class="action-btn" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="8" class="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <p>No orders found</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
    styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  private store = inject(Store);

  orders = this.store.selectSignal(selectOrders);
  isLoading = this.store.selectSignal(selectOrdersLoading);

  pendingOrders = computed(() => 
    this.orders().filter(o => o.status === OrderStatus.DRAFT || o.status === OrderStatus.CONFIRMED)
  );

  totalRevenue = computed(() => 
    this.orders().reduce((sum, o) => sum + o.totalAmount, 0)
  );

  ngOnInit(): void {
    this.store.dispatch(AppActions.loadOrders());
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatPayment(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}