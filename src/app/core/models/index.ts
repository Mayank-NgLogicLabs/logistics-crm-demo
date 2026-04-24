// Core domain models for Logistics CRM

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DISPATCHER = 'dispatcher',
  DRIVER = 'driver',
  VIEWER = 'viewer'
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  customerId: string;
  customerName: string;
  origin: Address;
  destination: Address;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  weight: number;
  dimensions: Dimensions;
  serviceType: ServiceType;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  assignedDriver?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export enum ShipmentStatus {
  PENDING = 'pending',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned'
}

export enum ShipmentPriority {
  LOW = 'low',
  STANDARD = 'standard',
  HIGH = 'high',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight'
}

export enum ServiceType {
  STANDARD = 'standard',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight',
  INTERNATIONAL = 'international',
  FREIGHT = 'freight'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: CustomerType;
  address: Address;
  creditLimit: number;
  balance: number;
  status: CustomerStatus;
  createdAt: Date;
  totalShipments: number;
}

export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  GOVERNMENT = 'government'
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  shipments: string[];
  status: OrderStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  REFUNDED = 'refunded'
}

export interface DashboardStats {
  totalShipments: number;
  pendingShipments: number;
  inTransitShipments: number;
  deliveredShipments: number;
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}