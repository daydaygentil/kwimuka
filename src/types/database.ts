export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agent_commissions: {
        Row: {
          id: string
          agent_id: string
          order_id: string
          service_provider_id: string
          amount: number
          commission_rate: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          order_id: string
          service_provider_id: string
          amount: number
          commission_rate: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          order_id?: string
          service_provider_id?: string
          amount?: number
          commission_rate?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_commissions_agent_id_fkey"
            columns: ["agent_id"]
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_commissions_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      agents: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          email: string
          is_active: boolean
          commission_rate: number
          total_earnings: number
          registered_services: string[]
          status: string
          avatar?: string
          created_at: string
          updated_at: string
          last_login_at?: string
          registered_on: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          email: string
          is_active?: boolean
          commission_rate?: number
          total_earnings?: number
          registered_services?: string[]
          status?: string
          avatar?: string
          created_at?: string
          updated_at?: string
          last_login_at?: string
          registered_on?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          email?: string
          is_active?: boolean
          commission_rate?: number
          total_earnings?: number
          registered_services?: string[]
          status?: string
          avatar?: string
          created_at?: string
          updated_at?: string
          last_login_at?: string
          registered_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      withdrawal_requests: {
        Row: {
          id: string
          agent_id: string
          amount: number
          phone_number: string
          status: 'processing' | 'paid' | 'failed'
          notes?: string
          created_at: string
          updated_at: string
          processed_at?: string
        }
        Insert: {
          id?: string
          agent_id: string
          amount: number
          phone_number: string
          status?: 'processing' | 'paid' | 'failed'
          notes?: string
          created_at?: string
          updated_at?: string
          processed_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          amount?: number
          phone_number?: string
          status?: 'processing' | 'paid' | 'failed'
          notes?: string
          created_at?: string
          updated_at?: string
          processed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_agent_id_fkey"
            columns: ["agent_id"]
            referencedRelation: "agents"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          phone_number: string
          pickup_address: string
          delivery_address: string
          pickup_coords: Json
          delivery_coords: Json
          distance: number
          services: Json
          total_cost: number
          status: string
          assigned_driver: string | null
          assigned_driver_name: string | null
          assigned_driver_phone: string | null
          created_at: string
          is_vip: boolean
          special_items_description: string | null
          payment_method: string | null
          payment_timing: string | null
        }
        Insert: {
          id?: string
          customer_name: string
          phone_number: string
          pickup_address: string
          delivery_address: string
          pickup_coords: Json
          delivery_coords: Json
          distance: number
          services: Json
          total_cost: number
          status?: string
          assigned_driver?: string | null
          assigned_driver_name?: string | null
          assigned_driver_phone?: string | null
          created_at?: string
          is_vip?: boolean
          special_items_description?: string | null
          payment_method?: string | null
          payment_timing?: string | null
        }
        Update: {
          id?: string
          customer_name?: string
          phone_number?: string
          pickup_address?: string
          delivery_address?: string
          pickup_coords?: Json
          delivery_coords?: Json
          distance?: number
          services?: Json
          total_cost?: number
          status?: string
          assigned_driver?: string | null
          assigned_driver_name?: string | null
          assigned_driver_phone?: string | null
          created_at?: string
          is_vip?: boolean
          special_items_description?: string | null
          payment_method?: string | null
          payment_timing?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface AgentCommissionRow {
  id: string;
  agent_id: string;
  service_type: 'truck_transport' | 'moving_helpers' | 'cleaning' | 'key_delivery';
  amount: number;
  status: string;
  created_at: string;
  approved_at?: string;
  order_id: string;
}

export interface WithdrawalRequestRow {
  id: string;
  agent_id: string;
  amount: number;
  phone_number: string;
  status: string;
  created_at: string;
  processed_at?: string;
  notes?: string;
}