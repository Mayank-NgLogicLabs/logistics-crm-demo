import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Customer } from '../../core/models/customer.model';

export const CustomersActions = createActionGroup({
  source: 'Customers',
  events: {
    'Load Customers': emptyProps(),
    'Load Customers Success': props<{ customers: Customer[] }>(),
    'Load Customers Failure': props<{ error: string }>(),
    'Select Customer': props<{ id: string }>(),
    'Clear Selected': emptyProps(),
    'Set Search': props<{ query: string }>(),
    'Add Customer Success': props<{ customer: Customer }>(),
  }
});
