import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ShipmentsActions } from '../../../store/shipments/shipments.actions';
import { selectSelectedShipment } from '../../../store/shipments/shipments.selectors';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent],
  template: `
    <div class="page-shell">
      <div class="page-header">
        <div class="breadcrumb">
          <a routerLink="/shipments" class="btn btn-ghost btn-sm">← Back to Shipments</a>
        </div>
      </div>

      @if (shipment()) {
        <div class="detail-layout">
          <div class="detail-main">
            <div class="card">
              <div class="detail-header">
                <div>
                  <h1 class="tracking-id">{{ shipment()!.trackingId }}</h1>
                  <app-status-badge [status]="shipment()!.status" />
                </div>
                <div class="detail-value">\${{ (shipment()!.value / 1000).toFixed(0) }}K</div>
              </div>
              <div class="divider"></div>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Customer</span>
                  <a [routerLink]="['/customers', shipment()!.customerId]" class="detail-val link">{{ shipment()!.customerName }}</a>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Description</span>
                  <span class="detail-val">{{ shipment()!.description }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Weight</span>
                  <span class="detail-val">{{ shipment()!.weight }} kg</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Driver</span>
                  <span class="detail-val">{{ shipment()!.driverName ?? 'Unassigned' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Created</span>
                  <span class="detail-val">{{ shipment()!.createdAt }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">ETA</span>
                  <span class="detail-val">{{ shipment()!.estimatedDelivery }}</span>
                </div>
                @if (shipment()!.actualDelivery) {
                  <div class="detail-item">
                    <span class="detail-label">Delivered</span>
                    <span class="detail-val" style="color: var(--success)">{{ shipment()!.actualDelivery }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Route card -->
            <div class="card route-card">
              <h2 class="heading-sm" style="margin-bottom:1.25rem">Route</h2>
              <div class="route-vis">
                <div class="route-point">
                  <div class="route-dot origin"></div>
                  <div>
                    <div class="route-city">{{ shipment()!.origin }}</div>
                    <div class="text-xs text-muted">Origin</div>
                  </div>
                </div>
                <div class="route-line">
                  <div class="route-arrow"></div>
                </div>
                <div class="route-point">
                  <div class="route-dot destination"></div>
                  <div>
                    <div class="route-city">{{ shipment()!.destination }}</div>
                    <div class="text-xs text-muted">Destination</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-sidebar">
            <div class="card">
              <h2 class="heading-sm" style="margin-bottom:1rem">Actions</h2>
              <div class="action-list">
                <button class="btn btn-primary w-full">Update Status</button>
                <button class="btn btn-outline w-full">Assign Driver</button>
                <button class="btn btn-ghost w-full">Download POD</button>
              </div>
            </div>
          </div>
        </div>
      } @else if (isLoading()) {
        <div class="skeleton" style="height: 400px; border-radius: var(--radius-xl)"></div>
      } @else {
        <div class="card empty-state">
          <p class="text-muted">Shipment not found.</p>
          <a routerLink="/shipments" class="btn btn-primary">← Back to Shipments</a>
        </div>
      }
    </div>
  `,
  styleUrl: './shipment-detail.component.scss'
})
export class ShipmentDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  shipment  = toSignal(this.store.select(selectSelectedShipment));
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(ShipmentsActions.loadShipments());
      this.store.dispatch(ShipmentsActions.selectShipment({ id }));
    }
    setTimeout(() => this.isLoading.set(false), 700);
  }
}
