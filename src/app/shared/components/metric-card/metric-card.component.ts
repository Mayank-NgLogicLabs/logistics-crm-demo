import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface MetricCardData {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="metric-card" [class]="'accent-' + (data.color ?? 'default')">
      <div class="metric-top">
        <div class="metric-icon" [innerHTML]="data.icon"></div>
        @if (data.change !== undefined) {
          <span class="metric-change" [class.positive]="data.change >= 0" [class.negative]="data.change < 0">
            {{ data.change >= 0 ? '↑' : '↓' }} {{ data.change | number:'1.1-1' }}%
          </span>
        }
      </div>
      <div class="metric-value">{{ data.value }}</div>
      <div class="metric-label">{{ data.label }}</div>
      @if (data.changeLabel) {
        <div class="metric-sublabel">{{ data.changeLabel }}</div>
      }
    </div>
  `,
  styleUrl: './metric-card.component.scss'
})
export class MetricCardComponent {
  @Input({ required: true }) data!: MetricCardData;
}
