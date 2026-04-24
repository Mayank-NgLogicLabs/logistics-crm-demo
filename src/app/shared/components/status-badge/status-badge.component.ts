import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
  styles: [`
    :host { display: inline-flex; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
  `]
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;

  get label(): string {
    const map: Record<string, string> = {
      in_transit: '● In Transit',
      delivered: '✓ Delivered',
      delayed: '⚠ Delayed',
      customs_hold: '⧗ Customs Hold',
      pending: '◌ Pending',
      active: '● Active',
      maintenance: '⚙ Maintenance',
      idle: '◌ Idle',
    };
    return map[this.status] ?? this.status;
  }
}
