export type ShipmentStatus = 'in_transit' | 'delivered' | 'delayed' | 'customs_hold' | 'pending';

export interface Shipment {
  id: string;
  trackingId: string;
  customerId: string;
  customerName: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  weight: number;
  vehicleId?: string;
  driverName?: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  description: string;
  value: number;
}

export interface ShipmentFilter {
  status: ShipmentStatus | 'all';
  search: string;
  page: number;
  pageSize: number;
}
