import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ShipmentsActions } from '../../../store/shipments/shipments.actions';
import { selectSelectedShipment } from '../../../store/shipments/shipments.selectors';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent],
  templateUrl: './shipment-detail.component.html',
  styleUrl: './shipment-detail.component.scss'
})
export class ShipmentDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  shipment  = toSignal(this.store.select(selectSelectedShipment));
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(ShipmentsActions.loadShipments());
      this.store.dispatch(ShipmentsActions.selectShipment({ id }));
    }
    setTimeout(() => this.isLoading.set(false), 700);
  }
}
