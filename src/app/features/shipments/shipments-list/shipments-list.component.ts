import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ShipmentsActions } from '../../../store/shipments/shipments.actions';
import { selectFilteredShipments, selectFilter, selectIsLoading, selectShipmentStats } from '../../../store/shipments/shipments.selectors';
import { ShipmentStatus } from '../../../core/models/shipment.model';

type ViewMode = 'table' | 'card';

const STATUS_TABS: { label: string; value: ShipmentStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Delayed', value: 'delayed' },
  { label: 'Customs Hold', value: 'customs_hold' },
  { label: 'Pending', value: 'pending' },
];

@Component({
    selector: 'app-shipments-list',
    imports: [RouterLink, StatusBadgeComponent, ReactiveFormsModule],
    templateUrl: './shipments-list.component.html',
    styleUrl: './shipments-list.component.scss',
    host: { style: 'display:block' }
})
export class ShipmentsListComponent implements OnInit {
  private store = inject(Store);

  shipments  = toSignal(this.store.select(selectFilteredShipments), { initialValue: [] });
  filter     = toSignal(this.store.select(selectFilter), { initialValue: { status: 'all' as const, search: '', page: 1, pageSize: 10 } });
  isLoading  = toSignal(this.store.select(selectIsLoading), { initialValue: false });
  stats      = toSignal(this.store.select(selectShipmentStats), { initialValue: { total: 0, inTransit: 0, delivered: 0, delayed: 0, pending: 0, customsHold: 0 } });

  viewMode   = signal<ViewMode>('table');
  statusTabs = STATUS_TABS;
  showForm   = signal(false);

  page     = signal(1);
  pageSize = signal(8);

  pagedShipments = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.shipments().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => Math.ceil(this.shipments().length / this.pageSize()));

  shipmentForm = new FormGroup({
    customerName:      new FormControl('', Validators.required),
    origin:            new FormControl('', Validators.required),
    destination:       new FormControl('', Validators.required),
    description:       new FormControl('', Validators.required),
    weight:            new FormControl<number>(100, [Validators.required, Validators.min(1)]),
    value:             new FormControl<number>(5000, [Validators.required, Validators.min(1)]),
    estimatedDelivery: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.store.dispatch(ShipmentsActions.loadShipments());
  }

  setStatus(status: ShipmentStatus | 'all'): void {
    this.page.set(1);
    this.store.dispatch(ShipmentsActions.setFilter({ filter: { status } }));
  }

  setSearch(value: string): void {
    this.page.set(1);
    this.store.dispatch(ShipmentsActions.setFilter({ filter: { search: value } }));
  }

  prevPage(): void { if (this.page() > 1) this.page.update(p => p - 1); }
  nextPage(): void { if (this.page() < this.totalPages()) this.page.update(p => p + 1); }

  submitShipment(): void {
    if (this.shipmentForm.invalid) { this.shipmentForm.markAllAsTouched(); return; }
    const f = this.shipmentForm.value;
    const newShipment = {
      id: 'sh' + Date.now(),
      trackingId: 'FF-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-3),
      customerId: 'c-new',
      customerName: f.customerName!,
      origin: f.origin!,
      destination: f.destination!,
      description: f.description!,
      weight: f.weight!,
      value: f.value!,
      status: 'pending' as ShipmentStatus,
      estimatedDelivery: f.estimatedDelivery!,
      createdAt: new Date().toISOString().split('T')[0],
      driverName: undefined,
      actualDelivery: undefined,
    };
    this.store.dispatch(ShipmentsActions.addShipment({ shipment: newShipment }));
    this.shipmentForm.reset({ weight: 100, value: 5000 });
    this.showForm.set(false);
  }
}
