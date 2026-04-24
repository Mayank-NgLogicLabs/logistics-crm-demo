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
  templateUrl: './reports.component.html',
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
