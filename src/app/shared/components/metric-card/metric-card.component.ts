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
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss'
})
export class MetricCardComponent {
  @Input({ required: true }) data!: MetricCardData;
}
