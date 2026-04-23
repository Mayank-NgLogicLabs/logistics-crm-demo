import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAlerts, selectMetrics, selectPriorityShipments, selectWorkflows } from '../../store/crm/crm.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly store = inject(Store);

  protected readonly focusModes = ['Today', 'Exceptions', 'VIP Accounts'] as const;
  protected readonly activeMode = signal<(typeof this.focusModes)[number]>('Today');
  protected readonly metrics = this.store.selectSignal(selectMetrics);
  protected readonly alerts = this.store.selectSignal(selectAlerts);
  protected readonly workflows = this.store.selectSignal(selectWorkflows);
  protected readonly priorityShipments = this.store.selectSignal(selectPriorityShipments);
  protected readonly headline = computed(() =>
    this.activeMode() === 'Exceptions'
      ? 'Operational exceptions requiring immediate review'
      : this.activeMode() === 'VIP Accounts'
        ? 'Enterprise customer commitments across strategic lanes'
        : 'A live overview of dispatch, load health, and revenue movement'
  );

}
