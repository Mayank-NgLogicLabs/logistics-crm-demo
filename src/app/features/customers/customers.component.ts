import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AppActions from '../../store/app/app.actions';
import { 
  selectCustomers, 
  selectCustomersLoading
} from '../../store/app/app.selectors';
import { Customer, CustomerStatus } from '../../core/models';

@Component({
    selector: 'app-customers',
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <div class="customers-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Customers</h1>
          <p>Manage your customer database</p>
        </div>
        <button class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Customer
        </button>
      </header>

      <!-- Stats Cards -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ customers().length }}</span>
            <span class="stat-label">Total Customers</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ activeCount() }}</span>
            <span class="stat-label">Active</span>
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
            <span class="stat-value">{{ totalBalance() | currency }}</span>
            <span class="stat-label">Total Balance</span>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search customers..." 
            [(ngModel)]="searchQuery"
            (input)="filterCustomers()"
          />
        </div>
        <select [(ngModel)]="typeFilter" (change)="filterCustomers()" class="filter-select">
          <option value="all">All Types</option>
          <option value="business">Business</option>
          <option value="individual">Individual</option>
          <option value="government">Government</option>
        </select>
      </div>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
        </div>
      } @else {
        <!-- Customers Grid -->
        <div class="customers-grid">
          @for (customer of filteredCustomers(); track customer.id) {
            <div class="customer-card">
              <div class="customer-header">
                <div class="customer-avatar">
                  {{ getInitials(customer.name) }}
                </div>
                <div class="customer-info">
                  <h3>{{ customer.name }}</h3>
                  @if (customer.company) {
                    <span class="company">{{ customer.company }}</span>
                  }
                </div>
                <span class="status-badge" [attr.data-status]="customer.status">
                  {{ customer.status }}
                </span>
              </div>
              
              <div class="customer-details">
                <div class="detail-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>{{ customer.email }}</span>
                </div>
                <div class="detail-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{{ customer.phone }}</span>
                </div>
                <div class="detail-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{{ customer.address.city }}, {{ customer.address.state }}</span>
                </div>
              </div>

              <div class="customer-stats">
                <div class="stat">
                  <span class="stat-label">Shipments</span>
                  <span class="stat-value">{{ customer.totalShipments }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Balance</span>
                  <span class="stat-value">{{ customer.balance | currency }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Credit Limit</span>
                  <span class="stat-value">{{ customer.creditLimit | currency }}</span>
                </div>
              </div>

              <div class="customer-actions">
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
                <button class="action-btn" title="Create Order">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              <p>No customers found</p>
            </div>
          }
        </div>
      }
    </div>
  `,
    styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  private store = inject(Store);

  customers = this.store.selectSignal(selectCustomers);
  isLoading = this.store.selectSignal(selectCustomersLoading);

  searchQuery = '';
  typeFilter = 'all';

  activeCount = computed(() => 
    this.customers().filter(c => c.status === CustomerStatus.ACTIVE).length
  );

  totalBalance = computed(() => 
    this.customers().reduce((sum, c) => sum + c.balance, 0)
  );

  filteredCustomers = computed(() => {
    let result = this.customers();
    
    if (this.typeFilter !== 'all') {
      result = result.filter(c => c.type === this.typeFilter);
    }
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.company?.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    }
    
    return result;
  });

  ngOnInit(): void {
    this.store.dispatch(AppActions.loadCustomers());
  }

  filterCustomers(): void {
    // Trigger re-computation
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}