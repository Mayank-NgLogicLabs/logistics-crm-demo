import { Component, OnInit, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MetricCardComponent, MetricCardData } from '../../shared/components/metric-card/metric-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ShipmentsActions } from '../../store/shipments/shipments.actions';
import { selectShipments, selectIsLoading, selectShipmentStats } from '../../store/shipments/shipments.selectors';
import { selectFleetStats } from '../../store/fleet/fleet.selectors';
import { FleetActions } from '../../store/fleet/fleet.actions';
import { DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MetricCardComponent, StatusBadgeComponent, DecimalPipe, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  host: { style: 'display:block' }
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);

  shipments   = toSignal(this.store.select(selectShipments), { initialValue: [] });
  isLoading   = toSignal(this.store.select(selectIsLoading), { initialValue: false });
  stats       = toSignal(this.store.select(selectShipmentStats), { initialValue: { total: 0, inTransit: 0, delivered: 0, delayed: 0, pending: 0, customsHold: 0 } });
  fleetStats  = toSignal(this.store.select(selectFleetStats), { initialValue: { total: 0, active: 0, maintenance: 0, idle: 0 } });

  recentShipments = computed(() => this.shipments().slice(0, 5));

  metrics = computed<MetricCardData[]>(() => {
    const s = this.stats();
    const f = this.fleetStats();
    const totalRev = this.shipments().reduce((a, b) => a + b.value, 0);
    const onTimeRate = s.total ? Math.round((s.delivered / s.total) * 100) : 0;
    return [
      { label: 'Total Shipments', value: s.total, change: 12.4, changeLabel: 'vs last month', color: 'default', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
      { label: 'On-Time Rate', value: `${onTimeRate}%`, change: 3.1, changeLabel: 'vs last month', color: 'success', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` },
      { label: 'Active Fleet', value: `${f.active}/${f.total}`, change: -1, changeLabel: '1 in maintenance', color: 'info', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>` },
      { label: 'Revenue MTD', value: `$${(totalRev / 1000).toFixed(0)}K`, change: 8.7, changeLabel: 'vs last month', color: 'warning', icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>` },
    ];
  });

  chartData = computed(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const vals = [4, 7, 5, 9, 6, 3, 8];
    const max = Math.max(...vals);
    return days.map((d, i) => ({ day: d, value: vals[i], pct: Math.round((vals[i] / max) * 100) }));
  });

  alerts = computed(() =>
    this.shipments().filter(s => s.status === 'delayed' || s.status === 'customs_hold')
  );

  ngOnInit(): void {
    this.store.dispatch(ShipmentsActions.loadShipments());
    this.store.dispatch(FleetActions.loadFleet());
  }
}
