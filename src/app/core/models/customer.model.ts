export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  totalShipments: number;
  activeShipments: number;
  totalRevenue: number;
  joinedDate: string;
  status: 'active' | 'inactive';
  industry: string;
}
