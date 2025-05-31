
export type WorkerType = 'driver' | 'helper' | 'cleaner' | 'delivery';

export interface Worker {
  id: string;
  name: string;
  phone: string;
  type: WorkerType;
  isAvailable: boolean;
  currentJobs: string[];
  vipCertified?: boolean;
  rating?: number;
  totalCompletedJobs?: number;
}

export interface JobAssignment {
  id: string;
  orderId: string;
  serviceType: 'transport' | 'helpers' | 'cleaning' | 'keyDelivery';
  assignedWorker?: Worker;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  assignedAt?: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  timeoutId?: NodeJS.Timeout;
}

export interface ServiceNotification {
  id: string;
  workerId: string;
  jobAssignmentId: string;
  message: string;
  type: 'job_offer' | 'status_update' | 'timeout_warning';
  createdAt: Date;
  expiresAt?: Date;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: 'customer' | 'admin' | 'driver' | 'helper' | 'cleaner' | 'agent';
  createdAt: Date;
}

export interface SMSSettings {
  id: string;
  message: string;
  isActive: boolean;
  updatedBy: string;
  updatedAt: Date;
}
