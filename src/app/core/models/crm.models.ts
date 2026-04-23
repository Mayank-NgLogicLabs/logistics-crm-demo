export type ShipmentStatus = 'In Transit' | 'Pending Pickup' | 'Delivered' | 'Delayed';
export type PriorityLevel = 'Critical' | 'High' | 'Medium';

export interface UserSession {
  name: string;
  email: string;
  role: 'Operations Lead' | 'Regional Manager';
}

export interface Shipment {
  id: string;
  customer: string;
  route: string;
  eta: string;
  status: ShipmentStatus;
  priority: PriorityLevel;
  value: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  segment: string;
  region: string;
  activeLoads: number;
  healthScore: number;
}

export interface AlertItem {
  id: string;
  title: string;
  detail: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface PerformanceMetric {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export interface WorkflowItem {
  title: string;
  owner: string;
  dueIn: string;
}

export interface CrmState {
  metrics: PerformanceMetric[];
  shipments: Shipment[];
  customers: CustomerAccount[];
  alerts: AlertItem[];
  workflows: WorkflowItem[];
}
