import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Shipment } from '../models/shipment.model';
import { Customer } from '../models/customer.model';
import { Vehicle } from '../models/fleet.model';
import { Notification } from '../models/notification.model';

const SHIPMENTS: Shipment[] = [
  { id: 's1', trackingId: 'FF-2024-001', customerId: 'c1', customerName: 'GlobalTech Inc.', origin: 'Mumbai', destination: 'Dubai', status: 'in_transit', weight: 1240, vehicleId: 'v1', driverName: 'Raj Patel', estimatedDelivery: '2026-04-28', createdAt: '2026-04-20', description: 'Electronic Components', value: 85000 },
  { id: 's2', trackingId: 'FF-2024-002', customerId: 'c2', customerName: 'NovaTrade Ltd.', origin: 'Delhi', destination: 'Singapore', status: 'delivered', weight: 560, vehicleId: 'v2', driverName: 'Priya Singh', estimatedDelivery: '2026-04-22', actualDelivery: '2026-04-22', createdAt: '2026-04-15', description: 'Textile Goods', value: 32000 },
  { id: 's3', trackingId: 'FF-2024-003', customerId: 'c3', customerName: 'Meridian Corp.', origin: 'Chennai', destination: 'London', status: 'delayed', weight: 890, vehicleId: 'v3', driverName: 'Ahmad Hassan', estimatedDelivery: '2026-04-26', createdAt: '2026-04-18', description: 'Auto Parts', value: 128000 },
  { id: 's4', trackingId: 'FF-2024-004', customerId: 'c4', customerName: 'Apex Logistics', origin: 'Bangalore', destination: 'Frankfurt', status: 'customs_hold', weight: 2100, vehicleId: 'v4', driverName: 'Chen Wei', estimatedDelivery: '2026-04-30', createdAt: '2026-04-19', description: 'Industrial Machinery', value: 340000 },
  { id: 's5', trackingId: 'FF-2024-005', customerId: 'c5', customerName: 'SwiftCargo Co.', origin: 'Kolkata', destination: 'Sydney', status: 'pending', weight: 340, createdAt: '2026-04-24', estimatedDelivery: '2026-05-02', description: 'Pharmaceutical Supplies', value: 67000 },
  { id: 's6', trackingId: 'FF-2024-006', customerId: 'c1', customerName: 'GlobalTech Inc.', origin: 'Hyderabad', destination: 'New York', status: 'in_transit', weight: 780, vehicleId: 'v5', driverName: 'Sanjay Kumar', estimatedDelivery: '2026-05-01', createdAt: '2026-04-22', description: 'Software Hardware', value: 95000 },
  { id: 's7', trackingId: 'FF-2024-007', customerId: 'c6', customerName: 'Pinnacle Exports', origin: 'Pune', destination: 'Tokyo', status: 'delivered', weight: 420, driverName: 'Amira Hossain', estimatedDelivery: '2026-04-20', actualDelivery: '2026-04-19', createdAt: '2026-04-12', description: 'Packaged Food', value: 28000 },
  { id: 's8', trackingId: 'FF-2024-008', customerId: 'c7', customerName: 'Atlas Freight', origin: 'Ahmedabad', destination: 'Dubai', status: 'in_transit', weight: 1560, vehicleId: 'v6', driverName: 'James Miller', estimatedDelivery: '2026-04-29', createdAt: '2026-04-21', description: 'Garments & Apparel', value: 54000 },
  { id: 's9', trackingId: 'FF-2024-009', customerId: 'c8', customerName: 'Blue Ocean Trade', origin: 'Kochi', destination: 'Rotterdam', status: 'delayed', weight: 3200, vehicleId: 'v7', driverName: 'Lars Eriksson', estimatedDelivery: '2026-04-27', createdAt: '2026-04-17', description: 'Spices & Condiments', value: 210000 },
  { id: 's10', trackingId: 'FF-2024-010', customerId: 'c2', customerName: 'NovaTrade Ltd.', origin: 'Surat', destination: 'Milan', status: 'pending', weight: 670, createdAt: '2026-04-24', estimatedDelivery: '2026-05-05', description: 'Diamonds & Gems', value: 890000 },
  { id: 's11', trackingId: 'FF-2024-011', customerId: 'c9', customerName: 'Crest Shipping', origin: 'Vizag', destination: 'Hamburg', status: 'in_transit', weight: 2800, vehicleId: 'v8', driverName: 'Omar Farooq', estimatedDelivery: '2026-05-03', createdAt: '2026-04-23', description: 'Steel Pipes', value: 175000 },
  { id: 's12', trackingId: 'FF-2024-012', customerId: 'c10', customerName: 'United Cargo', origin: 'Jaipur', destination: 'Paris', status: 'delivered', weight: 230, driverName: 'Fatima Al-Rashid', estimatedDelivery: '2026-04-21', actualDelivery: '2026-04-21', createdAt: '2026-04-14', description: 'Handicrafts', value: 18000 },
];

const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Arjun Mehta', company: 'GlobalTech Inc.', email: 'arjun@globaltech.com', phone: '+91-98765-43210', address: '14 Nariman Point', city: 'Mumbai', country: 'India', totalShipments: 48, activeShipments: 3, totalRevenue: 820000, joinedDate: '2022-03-15', status: 'active', industry: 'Technology' },
  { id: 'c2', name: 'Lena Hoffman', company: 'NovaTrade Ltd.', email: 'lena@novatrade.eu', phone: '+49-30-12345678', address: '22 Berliner Strasse', city: 'Berlin', country: 'Germany', totalShipments: 31, activeShipments: 1, totalRevenue: 560000, joinedDate: '2023-01-10', status: 'active', industry: 'Trading' },
  { id: 'c3', name: 'David Okonkwo', company: 'Meridian Corp.', email: 'david@meridiancorp.uk', phone: '+44-20-98765432', address: '5 Canary Wharf', city: 'London', country: 'UK', totalShipments: 22, activeShipments: 2, totalRevenue: 410000, joinedDate: '2023-06-20', status: 'active', industry: 'Automotive' },
  { id: 'c4', name: 'Mei Lin', company: 'Apex Logistics', email: 'mei@apexlog.sg', phone: '+65-9123-4567', address: '100 Cecil Street', city: 'Singapore', country: 'Singapore', totalShipments: 67, activeShipments: 5, totalRevenue: 1240000, joinedDate: '2021-09-05', status: 'active', industry: 'Logistics' },
  { id: 'c5', name: 'Ravi Sharma', company: 'SwiftCargo Co.', email: 'ravi@swiftcargo.in', phone: '+91-80-23456789', address: '7 MG Road', city: 'Bangalore', country: 'India', totalShipments: 15, activeShipments: 1, totalRevenue: 195000, joinedDate: '2024-02-14', status: 'active', industry: 'Healthcare' },
  { id: 'c6', name: 'Yuki Tanaka', company: 'Pinnacle Exports', email: 'yuki@pinnacle.jp', phone: '+81-3-12345678', address: '3-5 Marunouchi', city: 'Tokyo', country: 'Japan', totalShipments: 29, activeShipments: 0, totalRevenue: 320000, joinedDate: '2022-11-30', status: 'active', industry: 'Food & Beverage' },
  { id: 'c7', name: 'Sarah Johnson', company: 'Atlas Freight', email: 'sarah@atlasfreight.ae', phone: '+971-4-2345678', address: 'DIFC Gate District', city: 'Dubai', country: 'UAE', totalShipments: 41, activeShipments: 2, totalRevenue: 680000, joinedDate: '2022-07-18', status: 'active', industry: 'Fashion' },
  { id: 'c8', name: 'Klaus Bauer', company: 'Blue Ocean Trade', email: 'klaus@blueocean.nl', phone: '+31-10-9876543', address: 'Waalhaven 50', city: 'Rotterdam', country: 'Netherlands', totalShipments: 18, activeShipments: 1, totalRevenue: 290000, joinedDate: '2023-08-11', status: 'active', industry: 'Agriculture' },
  { id: 'c9', name: 'Ananya Patel', company: 'Crest Shipping', email: 'ananya@crestship.in', phone: '+91-891-2345678', address: '12 Port Area', city: 'Vizag', country: 'India', totalShipments: 9, activeShipments: 1, totalRevenue: 175000, joinedDate: '2024-04-01', status: 'active', industry: 'Steel & Metals' },
  { id: 'c10', name: 'Pierre Dupont', company: 'United Cargo', email: 'pierre@unitedcargo.fr', phone: '+33-1-23456789', address: '8 Rue de Rivoli', city: 'Paris', country: 'France', totalShipments: 35, activeShipments: 0, totalRevenue: 445000, joinedDate: '2022-05-22', status: 'inactive', industry: 'Arts & Crafts' },
];

const VEHICLES: Vehicle[] = [
  { id: 'v1', registrationNumber: 'MH-14-AB-1234', type: 'truck', make: 'Tata', model: 'Prima 4928.S', year: 2022, status: 'active', driverName: 'Raj Patel', currentLocation: 'Mumbai Port', assignedShipmentId: 's1', capacity: 30, mileage: 45200, lastMaintenance: '2026-03-15', fuelLevel: 72 },
  { id: 'v2', registrationNumber: 'DL-01-CD-5678', type: 'van', make: 'Mahindra', model: 'Supro', year: 2023, status: 'idle', currentLocation: 'Delhi Depot', capacity: 2, mileage: 18400, lastMaintenance: '2026-02-28', fuelLevel: 90 },
  { id: 'v3', registrationNumber: 'TN-09-EF-9012', type: 'truck', make: 'Ashok Leyland', model: 'Captain 3718', year: 2021, status: 'maintenance', currentLocation: 'Chennai Workshop', capacity: 22, mileage: 82100, lastMaintenance: '2026-04-10', fuelLevel: 35 },
  { id: 'v4', registrationNumber: 'KA-05-GH-3456', type: 'truck', make: 'BharatBenz', model: '3123R', year: 2023, status: 'active', driverName: 'Chen Wei', currentLocation: 'Bangalore Customs', assignedShipmentId: 's4', capacity: 25, mileage: 31600, lastMaintenance: '2026-03-20', fuelLevel: 58 },
  { id: 'v5', registrationNumber: 'AP-28-IJ-7890', type: 'truck', make: 'Volvo', model: 'FH 540', year: 2022, status: 'active', driverName: 'Sanjay Kumar', currentLocation: 'Hyderabad Airport', assignedShipmentId: 's6', capacity: 28, mileage: 54300, lastMaintenance: '2026-04-01', fuelLevel: 45 },
  { id: 'v6', registrationNumber: 'GJ-01-KL-2345', type: 'truck', make: 'Tata', model: 'Signa 4018.S', year: 2024, status: 'active', driverName: 'James Miller', currentLocation: 'Ahmedabad Depot', assignedShipmentId: 's8', capacity: 20, mileage: 12800, lastMaintenance: '2026-04-15', fuelLevel: 81 },
  { id: 'v7', registrationNumber: 'KL-07-MN-6789', type: 'ship', make: 'Maersk', model: 'Feeder Vessel', year: 2019, status: 'active', driverName: 'Lars Eriksson', currentLocation: 'Arabian Sea', assignedShipmentId: 's9', capacity: 500, mileage: 298000, lastMaintenance: '2026-01-10', fuelLevel: 62 },
  { id: 'v8', registrationNumber: 'AP-11-OP-0123', type: 'truck', make: 'Scania', model: 'R 500', year: 2023, status: 'active', driverName: 'Omar Farooq', currentLocation: 'Vizag Port', assignedShipmentId: 's11', capacity: 32, mileage: 28900, lastMaintenance: '2026-03-30', fuelLevel: 67 },
];

const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'error', title: 'Shipment Delayed', message: 'FF-2024-003 is delayed by 48 hours due to port congestion in Chennai.', timestamp: '2026-04-24T10:30:00', read: false, link: '/shipments/s3' },
  { id: 'n2', type: 'warning', title: 'Customs Hold', message: 'FF-2024-004 is held at Frankfurt customs. Documentation required.', timestamp: '2026-04-24T09:15:00', read: false, link: '/shipments/s4' },
  { id: 'n3', type: 'success', title: 'Shipment Delivered', message: 'FF-2024-007 delivered successfully to Tokyo on time.', timestamp: '2026-04-23T16:45:00', read: false, link: '/shipments/s7' },
  { id: 'n4', type: 'info', title: 'Vehicle Maintenance Due', message: 'TN-09-EF-9012 is scheduled for maintenance tomorrow.', timestamp: '2026-04-23T14:00:00', read: true, link: '/fleet' },
  { id: 'n5', type: 'warning', title: 'Low Fuel Alert', message: 'Vehicle TN-09-EF-9012 fuel level below 40%.', timestamp: '2026-04-23T11:30:00', read: true, link: '/fleet' },
];

@Injectable({ providedIn: 'root' })
export class MockDataService {
  getShipments(): Observable<Shipment[]> {
    return of(SHIPMENTS).pipe(delay(600));
  }

  getCustomers(): Observable<Customer[]> {
    return of(CUSTOMERS).pipe(delay(600));
  }

  getVehicles(): Observable<Vehicle[]> {
    return of(VEHICLES).pipe(delay(500));
  }

  getNotifications(): Observable<Notification[]> {
    return of(NOTIFICATIONS).pipe(delay(300));
  }

  getShipmentById(id: string): Observable<Shipment | undefined> {
    return of(SHIPMENTS.find(s => s.id === id)).pipe(delay(300));
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    return of(CUSTOMERS.find(c => c.id === id)).pipe(delay(300));
  }

  getShipmentsByCustomer(customerId: string): Observable<Shipment[]> {
    return of(SHIPMENTS.filter(s => s.customerId === customerId)).pipe(delay(300));
  }
}
