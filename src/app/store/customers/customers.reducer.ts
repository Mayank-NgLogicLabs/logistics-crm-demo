import { createFeature, createReducer, on } from '@ngrx/store';
import { Customer } from '../../core/models/customer.model';
import { CustomersActions } from './customers.actions';

export interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  selectedCustomer: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer(
    initialState,
    on(CustomersActions.loadCustomers, state => ({ ...state, isLoading: true, error: null })),
    on(CustomersActions.loadCustomersSuccess, (state, { customers }) => ({ ...state, customers, isLoading: false })),
    on(CustomersActions.loadCustomersFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
    on(CustomersActions.selectCustomer, (state, { id }) => ({
      ...state, selectedCustomer: state.customers.find(c => c.id === id) ?? null
    })),
    on(CustomersActions.clearSelected, state => ({ ...state, selectedCustomer: null })),
    on(CustomersActions.setSearch, (state, { query }) => ({ ...state, searchQuery: query })),
    on(CustomersActions.addCustomerSuccess, (state, { customer }) => ({
      ...state, customers: [customer, ...state.customers]
    })),
  )
});
