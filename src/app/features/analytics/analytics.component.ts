import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {
  protected readonly ranges = ['7 Days', '30 Days', 'Quarter'] as const;
  protected readonly activeRange = signal<(typeof this.ranges)[number]>('30 Days');
  protected readonly charts = computed(() => {
    const range = this.activeRange();
    if (range === '7 Days') {
      return [64, 72, 68, 77, 74, 83, 88];
    }

    if (range === 'Quarter') {
      return [48, 54, 59, 63, 66, 74, 79];
    }

    return [58, 61, 66, 68, 73, 77, 82];
  });
}
