import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AppActions from '../../store/app/app.actions';
import { 
  selectShipments, 
  selectShipmentsLoading
} from '../../store/app/app.selectors';
import { Shipment, ShipmentStatus } from '../../core/models';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="shipments-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Shipments</h1>
          <p>Manage and track all your shipments</p>
        </div>
        <button class="btn-primary" (click)="showNewShipmentForm.set(true)">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Shipment
        </button>
      </header>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search by tracking number..." 
            [(ngModel)]="searchQuery"
            (input)="filterShipments()"
          />
        </div>
        <div class="filter-tabs">
          <button 
            class="filter-tab" 
            [class.active]="activeFilter() === 'all'"
            (click)="setFilter('all')"
          >
            All <span class="count">{{ shipments().length }}</span>
          </button>
          <button 
            class="filter-tab" 
            [class.active]="activeFilter() === 'pending'"
            (click)="setFilter('pending')"
          >
            Pending <span class="count">{{ pendingCount() }}</span>
          </button>
          <button 
            class="filter-tab" 
            [class.active]="activeFilter() === 'in_transit'"
            (click)="setFilter('in_transit')"
          >
            In Transit <span class="count">{{ inTransitCount() }}</span>
          </button>
          <button 
            class="filter-tab" 
            [class.active]="activeFilter() === 'delivered'"
            (click)="setFilter('delivered')"
          >
            Delivered <span class="count">{{ deliveredCount() }}</span>
          </button>
        </div>
      </div>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
        </div>
      } @else {
        <!-- Shipments Table -->
        <div class="shipments-table-wrapper">
          <table class="shipments-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Customer</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Service</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (shipment of filteredShipments(); track shipment.id) {
                <tr>
                  <td class="tracking-cell">
                    <span class="tracking-number">{{ shipment.trackingNumber }}</span>
                  </td>
                  <td>{{ shipment.customerName }}</td>
                  <td>
                    <div class="location-cell">
                      <span class="city">{{ shipment.origin.city }}</span>
                      <span class="state">{{ shipment.origin.state }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="location-cell">
                      <span class="city">{{ shipment.destination.city }}</span>
                      <span class="state">{{ shipment.destination.state }}</span>
                    </div>
                  </td>
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
                  <td>
                    <span class="service-type">{{ shipment.serviceType }}</span>
                  </td>
                  <td class="date-cell">
                    {{ shipment.createdAt | date:'MMM d, y' }}
                  </td>
                  <td>
                    <div class="actions-cell">
                      <button class="action-btn" title="View Details" (click)="viewShipment(shipment)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button class="action-btn" title="Edit" (click)="editShipment(shipment)">
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
                  <td colspan="9" class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    <p>No shipments found</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styleUrl: './shipments.component.scss'
})
export class ShipmentsComponent implements OnInit {
  private store = inject(Store);

  // Signals - explicitly typed
  shipments = this.store.selectSignal<Shipment[]>(selectShipments);
  isLoading = this.store.selectSignal<boolean>(selectShipmentsLoading);
  
  searchQuery = '';
  activeFilter = signal<string>('all');
  showNewShipmentForm = signal(false);

  // Computed - explicitly typed
  pendingCount = computed<number>(() => 
    this.shipments().filter((s: Shipment) => s.status === ShipmentStatus.PENDING).length
  );
  inTransitCount = computed<number>(() => 
    this.shipments().filter((s: Shipment) => s.status === ShipmentStatus.IN_TRANSIT).length
  );
  deliveredCount = computed<number>(() => 
    this.shipments().filter((s: Shipment) => s.status === ShipmentStatus.DELIVERED).length
  );

  filteredShipments = computed<Shipment[]>(() => {
    let result: Shipment[] = [...this.shipments()];
    
    // Apply status filter
    if (this.activeFilter() !== 'all') {
      result = result.filter(s => s.status === this.activeFilter());
    }
    
    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(s => 
        s.trackingNumber.toLowerCase().includes(query) ||
        s.customerName.toLowerCase().includes(query)
      );
    }
    
    return result;
  });

  ngOnInit(): void {
    this.store.dispatch(AppActions.loadShipments());
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  filterShipments(): void {
    // Trigger re-computation by updating the filter
    this.activeFilter.set(this.activeFilter());
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  viewShipment(shipment: Shipment): void {
    console.log('View shipment:', shipment);
  }

  editShipment(shipment: Shipment): void {
    console.log('Edit shipment:', shipment);
  }
}