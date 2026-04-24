import { createSelector } from '@ngrx/store';
import { customersFeature } from './customers.reducer';

export const {
  selectCustomersState,
  selectCustomers,
  selectSelectedCustomer,
  selectSearchQuery,
  selectIsLoading,
  selectError,
} = customersFeature;

export const selectFilteredCustomers = createSelector(
  selectCustomers,
  selectSearchQuery,
  (customers, query) => {
    if (!query) return customers;
    const q = query.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  }
);
