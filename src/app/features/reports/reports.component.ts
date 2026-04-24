import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ShipmentsActions } from '../../store/shipments/shipments.actions';
import { selectShipments, selectShipmentStats } from '../../store/shipments/shipments.selectors';
import { selectCustomers } from '../../store/customers/customers.selectors';
import { selectFleetStats } from '../../store/fleet/fleet.selectors';
import { CustomersActions } from '../../store/customers/customers.actions';
import { FleetActions } from '../../store/fleet/fleet.actions';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="page-shell">
      <div class="page-header">
        <div>
          <h1 class="heading-lg">Reports & Analytics</h1>
          <p class="text-muted text-sm">Export and analyze your logistics data</p>
        </div>
        <button class="btn btn-primary" (click)="exportCSV()" id="export-csv-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      <!-- Date range filter -->
      <div class="card date-filter">
        <div class="date-filter-inner">
          <div class="input-wrap">
            <label for="date-from">From</label>
            <input type="date" id="date-from" class="input" [value]="dateFrom()" (change)="dateFrom.set($any($event.target).value)">
          </div>
          <div class="input-wrap">
            <label for="date-to">To</label>
            <input type="date" id="date-to" class="input" [value]="dateTo()" (change)="dateTo.set($any($event.target).value)">
          </div>
          <button class="btn btn-secondary" id="apply-filter-btn">Apply Filter</button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-4 stats-overview">
        <div class="card summary-card">
          <div class="s-label">Total Shipments</div>
          <div class="s-value">{{ stats().total }}</div>
          <div class="s-sub text-muted text-sm">All time records</div>
        </div>
        <div class="card summary-card">
          <div class="s-label">Total Revenue</div>
          <div class="s-value">\${{ (totalRevenue() / 1000).toFixed(0) }}K</div>
          <div class="s-sub text-muted text-sm">Across all customers</div>
        </div>
        <div class="card summary-card">
          <div class="s-label">Delivery Rate</div>
          <div class="s-value">{{ onTimeRate() }}%</div>
          <div class="s-sub text-muted text-sm">On-time deliveries</div>
        </div>
        <div class="card summary-card">
          <div class="s-label">Active Customers</div>
          <div class="s-value">{{ activeCustomers() }}</div>
          <div class="s-sub text-muted text-sm">With recent shipments</div>
        </div>
      </div>

      <!-- Status Breakdown -->
      <div class="report-row">
        <div class="card">
          <h2 class="heading-sm" style="margin-bottom:1.25rem">Status Breakdown</h2>
          @for (item of statusBreakdown(); track item.label) {
            <div class="breakdown-item">
              <div class="breakdown-label">
                <span class="breakdown-dot" [style.background]="item.color"></span>
                {{ item.label }}
              </div>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar" [style.width.%]="item.pct" [style.background]="item.color"></div>
              </div>
              <span class="breakdown-val">{{ item.count }} ({{ item.pct }}%)</span>
            </div>
          }
        </div>

        <div class="card">
          <h2 class="heading-sm" style="margin-bottom:1.25rem">Top Customers by Revenue</h2>
          <div class="top-customers">
            @for (c of topCustomers(); track c.company; let i = $index) {
              <div class="tc-item">
                <div class="tc-rank">{{ i + 1 }}</div>
                <div class="tc-info">
                  <div class="tc-name">{{ c.company }}</div>
                  <div class="tc-shipments text-xs text-muted">{{ c.totalShipments }} shipments</div>
                </div>
                <div class="tc-rev fw-700">\${{ (c.totalRevenue/1000).toFixed(0) }}K</div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Recent Export Preview -->
      <div class="card">
        <div class="section-header" style="margin-bottom: 0.875rem;">
          <h2 class="heading-sm">Data Preview</h2>
          <span class="text-sm text-muted">{{ shipments().length }} rows</span>
        </div>
        <div class="table-scroll">
          <table class="data-table" aria-label="Report data preview">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Weight (kg)</th>
                <th>Value (\$)</th>
                <th>Created</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              @for (s of shipments().slice(0, 8); track s.id) {
                <tr>
                  <td class="text-sm fw-600" style="font-family: monospace">{{ s.trackingId }}</td>
                  <td class="text-sm">{{ s.customerName }}</td>
                  <td class="text-sm">{{ s.status }}</td>
                  <td class="text-sm">{{ s.origin }}</td>
                  <td class="text-sm">{{ s.destination }}</td>
                  <td class="text-sm">{{ s.weight }}</td>
                  <td class="text-sm fw-600">{{ s.value | number }}</td>
                  <td class="text-sm">{{ s.createdAt }}</td>
                  <td class="text-sm">{{ s.estimatedDelivery }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  private store = inject(Store);

  shipments    = toSignal(this.store.select(selectShipments), { initialValue: [] });
  stats        = toSignal(this.store.select(selectShipmentStats), { initialValue: { total: 0, inTransit: 0, delivered: 0, delayed: 0, pending: 0, customsHold: 0 } });
  customers    = toSignal(this.store.select(selectCustomers), { initialValue: [] });
  fleetStats   = toSignal(this.store.select(selectFleetStats), { initialValue: { total: 0, active: 0, maintenance: 0, idle: 0 } });

  dateFrom = signal(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  dateTo   = signal(new Date().toISOString().split('T')[0]);

  totalRevenue = computed(() => this.shipments().reduce((a, s) => a + s.value, 0));
  onTimeRate   = computed(() => {
    const s = this.stats();
    return s.total ? Math.round((s.delivered / s.total) * 100) : 0;
  });
  activeCustomers = computed(() => this.customers().filter(c => c.activeShipments > 0).length);

  statusBreakdown = computed(() => {
    const s = this.stats();
    const t = s.total || 1;
    return [
      { label: 'In Transit',     count: s.inTransit,   pct: Math.round(s.inTransit   / t * 100), color: 'var(--status-transit)' },
      { label: 'Delivered',      count: s.delivered,   pct: Math.round(s.delivered   / t * 100), color: 'var(--status-delivered)' },
      { label: 'Delayed',        count: s.delayed,     pct: Math.round(s.delayed     / t * 100), color: 'var(--status-delayed)' },
      { label: 'Pending',        count: s.pending,     pct: Math.round(s.pending     / t * 100), color: 'var(--status-pending)' },
      { label: 'Customs Hold',   count: s.customsHold, pct: Math.round(s.customsHold / t * 100), color: 'var(--status-customs)' },
    ];
  });

  topCustomers = computed(() =>
    [...this.customers()].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5)
  );

  ngOnInit(): void {
    this.store.dispatch(ShipmentsActions.loadShipments());
    this.store.dispatch(CustomersActions.loadCustomers());
    this.store.dispatch(FleetActions.loadFleet());
  }

  exportCSV(): void {
    const headers = ['Tracking ID','Customer','Status','Origin','Destination','Weight(kg)','Value($)','Created','ETA'];
    const rows = this.shipments().map(s => [
      s.trackingId, s.customerName, s.status, s.origin, s.destination,
      s.weight, s.value, s.createdAt, s.estimatedDelivery
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'freightflow-shipments.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
