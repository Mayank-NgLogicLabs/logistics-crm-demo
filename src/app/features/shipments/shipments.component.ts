import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ShipmentStatus } from '../../core/models/crm.models';
import { selectShipments } from '../../store/crm/crm.selectors';

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.scss'
})
export class ShipmentsComponent {
  private readonly store = inject(Store);

  protected readonly filters = ['All', 'In Transit', 'Pending Pickup', 'Delivered', 'Delayed'] as const;
  protected readonly activeFilter = signal<(typeof this.filters)[number]>('All');
  protected readonly shipments = this.store.selectSignal(selectShipments);
  protected readonly filteredShipments = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') {
      return this.shipments();
    }

    return this.shipments().filter((shipment) => shipment.status === (filter as ShipmentStatus));
  });
}
