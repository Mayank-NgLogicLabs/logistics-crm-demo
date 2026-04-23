import { createFeature, createReducer } from '@ngrx/store';
import { mockCrmState } from '../../core/data/mock-crm-data';

export const crmFeature = createFeature({
  name: 'crm',
  reducer: createReducer(mockCrmState)
});
