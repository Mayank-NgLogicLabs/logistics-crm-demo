import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCustomers } from '../../store/crm/crm.selectors';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  private readonly store = inject(Store);

  protected readonly search = signal('');
  protected readonly customers = this.store.selectSignal(selectCustomers);
  protected readonly filteredCustomers = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.customers().filter((customer) =>
      !term || customer.name.toLowerCase().includes(term) || customer.segment.toLowerCase().includes(term)
    );
  });
}
