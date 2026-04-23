import { CrmState } from '../models/crm.models';

export const mockCrmState: CrmState = {
  metrics: [
    { label: 'On-time dispatch', value: '96.4%', delta: '+2.1%', positive: true },
    { label: 'Active revenue lanes', value: '128', delta: '+12', positive: true },
    { label: 'Claims at risk', value: '09', delta: '-3', positive: true },
    { label: 'Open customer escalations', value: '14', delta: '+4', positive: false }
  ],
  shipments: [
    {
      id: 'SH-30218',
      customer: 'Nordic Retail Group',
      route: 'Delhi -> Mumbai',
      eta: 'Today, 18:30',
      status: 'In Transit',
      priority: 'Critical',
      value: '₹8.2L'
    },
    {
      id: 'SH-30206',
      customer: 'Sterling Pharma',
      route: 'Pune -> Hyderabad',
      eta: 'Today, 14:15',
      status: 'Delayed',
      priority: 'High',
      value: '₹5.7L'
    },
    {
      id: 'SH-30192',
      customer: 'UrbanCart Fulfillment',
      route: 'Chennai -> Bengaluru',
      eta: 'Tomorrow, 08:00',
      status: 'Pending Pickup',
      priority: 'Medium',
      value: '₹2.9L'
    },
    {
      id: 'SH-30174',
      customer: 'AutoForge Components',
      route: 'Ahmedabad -> Jaipur',
      eta: 'Delivered, 10:20',
      status: 'Delivered',
      priority: 'Medium',
      value: '₹4.4L'
    }
  ],
  customers: [
    { id: 'CU-18', name: 'Nordic Retail Group', segment: 'Enterprise', region: 'West', activeLoads: 24, healthScore: 93 },
    { id: 'CU-11', name: 'Sterling Pharma', segment: 'Cold Chain', region: 'South', activeLoads: 16, healthScore: 86 },
    { id: 'CU-09', name: 'UrbanCart Fulfillment', segment: 'E-commerce', region: 'South', activeLoads: 31, healthScore: 79 },
    { id: 'CU-04', name: 'AutoForge Components', segment: 'Manufacturing', region: 'North', activeLoads: 11, healthScore: 88 }
  ],
  alerts: [
    { id: 'AL-1', title: 'Cold-chain sensor variance', detail: 'Sterling Pharma lane is beyond temp threshold for 18 minutes.', severity: 'High' },
    { id: 'AL-2', title: 'Carrier capacity warning', detail: 'North corridor utilization has crossed 92% for tomorrow dispatches.', severity: 'Medium' },
    { id: 'AL-3', title: 'Customer renewal window', detail: 'Nordic Retail annual contract review starts in 6 days.', severity: 'Low' }
  ],
  workflows: [
    { title: 'Escalate delayed pharma load', owner: 'Ritika', dueIn: '20 min' },
    { title: 'Approve surge carrier quote', owner: 'Neeraj', dueIn: '45 min' },
    { title: 'Share weekly SLA snapshot', owner: 'Aman', dueIn: '2 hrs' }
  ]
};
