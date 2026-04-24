import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { 
  Shipment, 
  Customer, 
  Order, 
  DashboardStats,
  ShipmentStatus,
  CustomerStatus,
  OrderStatus,
  PaymentStatus
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private mockShipments: Shipment[] = [
    {
      id: '1',
      trackingNumber: 'LGL-2024-001234',
      customerId: '1',
      customerName: 'Acme Corp',
      origin: { street: '123 Warehouse St', city: 'Los Angeles', state: 'CA', postalCode: '90001', country: 'USA' },
      destination: { street: '456 Business Ave', city: 'New York', state: 'NY', postalCode: '10001', country: 'USA' },
      status: ShipmentStatus.IN_TRANSIT,
      priority: 'high' as any,
      weight: 25.5,
      dimensions: { length: 30, width: 20, height: 15, unit: 'cm' },
      serviceType: 'express' as any,
      estimatedDelivery: new Date('2024-02-15'),
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-12')
    },
    {
      id: '2',
      trackingNumber: 'LGL-2024-001235',
      customerId: '2',
      customerName: 'TechStart Inc',
      origin: { street: '789 Tech Park', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'USA' },
      destination: { street: '321 Innovation Blvd', city: 'Seattle', state: 'WA', postalCode: '98101', country: 'USA' },
      status: ShipmentStatus.PENDING,
      priority: 'standard' as any,
      weight: 5.2,
      dimensions: { length: 20, width: 15, height: 10, unit: 'cm' },
      serviceType: 'standard' as any,
      estimatedDelivery: new Date('2024-02-20'),
      createdAt: new Date('2024-02-11'),
      updatedAt: new Date('2024-02-11')
    },
    {
      id: '3',
      trackingNumber: 'LGL-2024-001236',
      customerId: '1',
      customerName: 'Acme Corp',
      origin: { street: '123 Warehouse St', city: 'Los Angeles', state: 'CA', postalCode: '90001', country: 'USA' },
      destination: { street: '555 Commerce Center', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'USA' },
      status: ShipmentStatus.DELIVERED,
      priority: 'standard' as any,
      weight: 50,
      dimensions: { length: 40, width: 30, height: 25, unit: 'cm' },
      serviceType: 'standard' as any,
      estimatedDelivery: new Date('2024-02-12'),
      actualDelivery: new Date('2024-02-12'),
      createdAt: new Date('2024-02-08'),
      updatedAt: new Date('2024-02-12')
    },
    {
      id: '4',
      trackingNumber: 'LGL-2024-001237',
      customerId: '3',
      customerName: 'Global Retail',
      origin: { street: '100 Distribution Center', city: 'Dallas', state: 'TX', postalCode: '75201', country: 'USA' },
      destination: { street: '200 Mall Plaza', city: 'Miami', state: 'FL', postalCode: '33101', country: 'USA' },
      status: ShipmentStatus.OUT_FOR_DELIVERY,
      priority: 'express' as any,
      weight: 100,
      dimensions: { length: 60, width: 40, height: 30, unit: 'cm' },
      serviceType: 'overnight' as any,
      estimatedDelivery: new Date('2024-02-13'),
      createdAt: new Date('2024-02-12'),
      updatedAt: new Date('2024-02-13')
    },
    {
      id: '5',
      trackingNumber: 'LGL-2024-001238',
      customerId: '2',
      customerName: 'TechStart Inc',
      origin: { street: '789 Tech Park', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'USA' },
      destination: { street: '999 Startup Lane', city: 'Austin', state: 'TX', postalCode: '78701', country: 'USA' },
      status: ShipmentStatus.PENDING,
      priority: 'low' as any,
      weight: 2,
      dimensions: { length: 15, width: 10, height: 5, unit: 'cm' },
      serviceType: 'standard' as any,
      estimatedDelivery: new Date('2024-02-25'),
      createdAt: new Date('2024-02-13'),
      updatedAt: new Date('2024-02-13')
    }
  ];

  private mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Acme Corp',
      email: 'shipping@acmecorp.com',
      phone: '+1 555-1001',
      company: 'Acme Corporation',
      type: 'business' as any,
      address: { street: '123 Business Park', city: 'Los Angeles', state: 'CA', postalCode: '90001', country: 'USA' },
      creditLimit: 50000,
      balance: 12500,
      status: CustomerStatus.ACTIVE,
      createdAt: new Date('2023-01-15'),
      totalShipments: 156
    },
    {
      id: '2',
      name: 'TechStart Inc',
      email: 'logistics@techstart.io',
      phone: '+1 555-1002',
      company: 'TechStart Inc',
      type: 'business' as any,
      address: { street: '789 Innovation Way', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'USA' },
      creditLimit: 25000,
      balance: 3200,
      status: CustomerStatus.ACTIVE,
      createdAt: new Date('2023-03-20'),
      totalShipments: 42
    },
    {
      id: '3',
      name: 'Global Retail',
      email: 'supply@globalretail.com',
      phone: '+1 555-1003',
      company: 'Global Retail Inc',
      type: 'business' as any,
      address: { street: '500 Commerce Blvd', city: 'Dallas', state: 'TX', postalCode: '75201', country: 'USA' },
      creditLimit: 100000,
      balance: 45000,
      status: CustomerStatus.ACTIVE,
      createdAt: new Date('2022-08-10'),
      totalShipments: 523
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 555-2001',
      type: 'individual' as any,
      address: { street: '456 Residential St', city: 'Phoenix', state: 'AZ', postalCode: '85001', country: 'USA' },
      creditLimit: 5000,
      balance: 0,
      status: CustomerStatus.ACTIVE,
      createdAt: new Date('2024-01-05'),
      totalShipments: 8
    },
    {
      id: '5',
      name: 'Metro Government',
      email: 'procurement@metrogov.org',
      phone: '+1 555-3001',
      company: 'Metro Government',
      type: 'government' as any,
      address: { street: '100 City Hall', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'USA' },
      creditLimit: 75000,
      balance: 15000,
      status: CustomerStatus.ACTIVE,
      createdAt: new Date('2022-11-01'),
      totalShipments: 234
    }
  ];

  private mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-0001',
      customerId: '1',
      customerName: 'Acme Corp',
      shipments: ['1', '3'],
      status: OrderStatus.COMPLETED,
      totalAmount: 450,
      paymentStatus: PaymentStatus.PAID,
      notes: 'Bulk shipment order',
      createdAt: new Date('2024-02-08'),
      updatedAt: new Date('2024-02-12')
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-0002',
      customerId: '2',
      customerName: 'TechStart Inc',
      shipments: ['2'],
      status: OrderStatus.PROCESSING,
      totalAmount: 125,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: new Date('2024-02-11'),
      updatedAt: new Date('2024-02-11')
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-0003',
      customerId: '3',
      customerName: 'Global Retail',
      shipments: ['4'],
      status: OrderStatus.SHIPPED,
      totalAmount: 890,
      paymentStatus: PaymentStatus.PAID,
      createdAt: new Date('2024-02-12'),
      updatedAt: new Date('2024-02-13')
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-0004',
      customerId: '1',
      customerName: 'Acme Corp',
      shipments: [],
      status: OrderStatus.DRAFT,
      totalAmount: 0,
      paymentStatus: PaymentStatus.PENDING,
      notes: 'Pending confirmation',
      createdAt: new Date('2024-02-13'),
      updatedAt: new Date('2024-02-13')
    }
  ];

  getShipments(): Observable<Shipment[]> {
    return of(this.mockShipments).pipe(delay(500));
  }

  getCustomers(): Observable<Customer[]> {
    return of(this.mockCustomers).pipe(delay(500));
  }

  getOrders(): Observable<Order[]> {
    return of(this.mockOrders).pipe(delay(500));
  }

  getDashboardStats(): Observable<DashboardStats> {
    const stats: DashboardStats = {
      totalShipments: this.mockShipments.length,
      pendingShipments: this.mockShipments.filter(s => s.status === ShipmentStatus.PENDING).length,
      inTransitShipments: this.mockShipments.filter(s => s.status === ShipmentStatus.IN_TRANSIT).length,
      deliveredShipments: this.mockShipments.filter(s => s.status === ShipmentStatus.DELIVERED).length,
      totalCustomers: this.mockCustomers.length,
      activeCustomers: this.mockCustomers.filter(c => c.status === CustomerStatus.ACTIVE).length,
      totalRevenue: 156750,
      monthlyGrowth: 12.5
    };
    return of(stats).pipe(delay(300));
  }
}