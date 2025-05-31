export interface AgentCommission {
  id: string;
  agentId: string;
  serviceType: 'truck_transport' | 'moving_helpers' | 'cleaning' | 'key_delivery';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
  orderId: string;
}

export interface WithdrawalRequest {
  id: string;
  agentId: string;
  amount: number;
  phoneNumber: string;
  status: 'processing' | 'paid' | 'failed';
  createdAt: Date;
  processedAt?: Date;
  notes?: string;
}

export interface AgentProfile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  is_active: boolean;
  commission_rate: number;
  total_earnings: number;
  registered_services: string[];
  status: 'pending' | 'approved' | 'rejected';
  avatar?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  registered_on: string;
}
