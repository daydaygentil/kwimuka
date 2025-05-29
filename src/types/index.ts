
export type OrderStatus = 'pending' | 'assigned' | 'in-progress' | 'completed';
export type UserRole = 'customer' | 'driver' | 'helper' | 'cleaner' | 'admin' | 'agent';
export type ViewType = 'home' | 'order' | 'track' | 'driver' | 'admin' | 'agent' | 'unified-login' | 'help' | 'apply-jobs' | 'terms';

export interface JobApplication {
  id: string;
  name: string;
  phone: string;
  jobRole: 'helper' | 'cleaner' | 'driver';
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  pickupAddress: string;
  deliveryAddress: string;
  services: {
    transport: boolean;
    helpers: number;
    cleaning: boolean;
    keyDelivery: boolean;
  };
  distance: number;
  totalCost: number;
  status: OrderStatus;
  createdAt: Date;
  locationData?: {
    pickup: any;
    delivery: any;
  };
  assignedDriver?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
}
