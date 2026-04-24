import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CustomersActions } from '../../../store/customers/customers.actions';
import { selectFilteredCustomers, selectIsLoading } from '../../../store/customers/customers.selectors';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent, ReactiveFormsModule],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss',
  host: { style: 'display:block' }
})
export class CustomersListComponent implements OnInit {
  private store = inject(Store);

  customers   = toSignal(this.store.select(selectFilteredCustomers), { initialValue: [] });
  isLoading   = toSignal(this.store.select(selectIsLoading), { initialValue: false });
  searchQuery = signal('');
  showForm    = signal(false);

  customerForm = new FormGroup({
    name:     new FormControl('', Validators.required),
    company:  new FormControl('', Validators.required),
    email:    new FormControl('', [Validators.required, Validators.email]),
    phone:    new FormControl('', Validators.required),
    city:     new FormControl('', Validators.required),
    country:  new FormControl('', Validators.required),
    industry: new FormControl('', Validators.required),
    address:  new FormControl(''),
  });

  ngOnInit(): void {
    this.store.dispatch(CustomersActions.loadCustomers());
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.store.dispatch(CustomersActions.setSearch({ query: value }));
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  formatRevenue(val: number): string {
    return (val / 1000).toFixed(0) + 'K';
  }

  submitCustomer(): void {
    if (this.customerForm.invalid) { this.customerForm.markAllAsTouched(); return; }
    const f = this.customerForm.value;
    const newCustomer = {
      id: 'c' + Date.now(),
      name: f.name!,
      company: f.company!,
      email: f.email!,
      phone: f.phone!,
      city: f.city!,
      country: f.country!,
      industry: f.industry!,
      address: f.address || '',
      status: 'active' as const,
      totalShipments: 0,
      activeShipments: 0,
      totalRevenue: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    this.store.dispatch(CustomersActions.addCustomerSuccess({ customer: newCustomer }));
    this.customerForm.reset();
    this.showForm.set(false);
  }
}
