import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

interface LaneBoard {
  title: string;
  entries: { lane: string; progress: number; note: string }[];
}

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.scss'
})
export class OperationsComponent {
  protected readonly tabs = ['Carrier Desk', 'Dock Plan', 'Exception Board'] as const;
  protected readonly activeTab = signal<(typeof this.tabs)[number]>('Carrier Desk');

  private readonly boards: Record<(typeof this.tabs)[number], LaneBoard[]> = {
    'Carrier Desk': [
      { title: 'Capacity locks', entries: [{ lane: 'Delhi - Mumbai', progress: 88, note: 'Premium lane, renew today' }] },
      { title: 'Backup carriers', entries: [{ lane: 'Pune - Hyderabad', progress: 62, note: 'Two alternates verified' }] }
    ],
    'Dock Plan': [
      { title: 'Bay allocation', entries: [{ lane: 'Chennai outbound', progress: 74, note: '7 loads ready to move' }] },
      { title: 'Turnaround time', entries: [{ lane: 'Ahmedabad inbound', progress: 81, note: 'Target under 35 min' }] }
    ],
    'Exception Board': [
      { title: 'Claims watch', entries: [{ lane: 'Cold chain south', progress: 41, note: 'Pending customer callback' }] },
      { title: 'Escalation follow-up', entries: [{ lane: 'North corridor', progress: 57, note: 'Carrier RCA due by 5 PM' }] }
    ]
  };

  protected readonly activeBoards = computed(() => this.boards[this.activeTab()]);
}
