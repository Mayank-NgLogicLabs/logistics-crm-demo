import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CustomersActions } from '../../../store/customers/customers.actions';
import { ShipmentsActions } from '../../../store/shipments/shipments.actions';
import { selectSelectedCustomer } from '../../../store/customers/customers.selectors';
import { selectShipments } from '../../../store/shipments/shipments.selectors';
import { DecimalPipe, CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-customer-profile',
    imports: [RouterLink, StatusBadgeComponent, DecimalPipe, CurrencyPipe],
    templateUrl: './customer-profile.component.html',
    styleUrl: './customer-profile.component.scss'
})
export class CustomerProfileComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  customer  = toSignal(this.store.select(selectSelectedCustomer));
  allShipments = toSignal(this.store.select(selectShipments), { initialValue: [] });

  customerShipments = computed(() =>
    this.allShipments().filter(s => s.customerId === this.customer()?.id)
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(CustomersActions.loadCustomers());
      this.store.dispatch(ShipmentsActions.loadShipments());
      this.store.dispatch(CustomersActions.selectCustomer({ id }));
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }
}
