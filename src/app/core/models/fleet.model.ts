export type VehicleStatus = 'active' | 'maintenance' | 'idle';
export type VehicleType = 'truck' | 'van' | 'rail' | 'ship';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  status: VehicleStatus;
  driverName?: string;
  currentLocation?: string;
  assignedShipmentId?: string;
  capacity: number;
  mileage: number;
  lastMaintenance: string;
  fuelLevel: number;
}
