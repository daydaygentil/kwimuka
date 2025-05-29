export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      drivers_location: {
        Row: {
          driver_id: string | null
          id: string
          latitude: number
          longitude: number
          updated_at: string | null
        }
        Insert: {
          driver_id?: string | null
          id?: string
          latitude: number
          longitude: number
          updated_at?: string | null
        }
        Update: {
          driver_id?: string | null
          id?: string
          latitude?: number
          longitude?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_location_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          seen: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          seen?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          seen?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assigned_driver: string | null
          assigned_driver_name: string | null
          assigned_driver_phone: string | null
          created_at: string
          delivery_address: string
          delivery_coords: Json | null
          distance: number | null
          id: string
          phone_number: number
          pickup_address: string
          pickup_coords: Json | null
          service_type: string | null
          services: Json
          sms_error: string | null
          sms_status: string | null
          status: string
          total_cost: number
          updated_at: string
          user_name: string
        }
        Insert: {
          assigned_driver?: string | null
          assigned_driver_name?: string | null
          assigned_driver_phone?: string | null
          created_at?: string
          delivery_address: string
          delivery_coords?: Json | null
          distance?: number | null
          id: string
          phone_number: number
          pickup_address: string
          pickup_coords?: Json | null
          service_type?: string | null
          services: Json
          sms_error?: string | null
          sms_status?: string | null
          status?: string
          total_cost: number
          updated_at?: string
          user_name: string
        }
        Update: {
          assigned_driver?: string | null
          assigned_driver_name?: string | null
          assigned_driver_phone?: string | null
          created_at?: string
          delivery_address?: string
          delivery_coords?: Json | null
          distance?: number | null
          id?: string
          phone_number?: number
          pickup_address?: string
          pickup_coords?: Json | null
          service_type?: string | null
          services?: Json
          sms_error?: string | null
          sms_status?: string | null
          status?: string
          total_cost?: number
          updated_at?: string
          user_name?: string
        }
        Relationships: []
      }
      real_notifications: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number
          id: string
          name: string
        }
        Insert: {
          base_price: number
          id?: string
          name: string
        }
        Update: {
          base_price?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      sms_logs: {
        Row: {
          error: string | null
          id: string
          message: string
          order_id: string
          phone_number: number
          status: string
          timestamp: string
        }
        Insert: {
          error?: string | null
          id?: string
          message: string
          order_id: string
          phone_number: number
          status: string
          timestamp?: string
        }
        Update: {
          error?: string | null
          id?: string
          message?: string
          order_id?: string
          phone_number?: number
          status?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          password_hash: string | null
          phone: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          password_hash?: string | null
          phone: string
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          password_hash?: string | null
          phone?: string
          role?: string
        }
        Relationships: []
      }
      worker_profiles: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string
          updated_at: string | null
          user_id: string | null
          vip_certified: boolean | null
          worker_type: string
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone: string
          updated_at?: string | null
          user_id?: string | null
          vip_certified?: boolean | null
          worker_type: string
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string
          updated_at?: string | null
          user_id?: string | null
          vip_certified?: boolean | null
          worker_type?: string
        }
        Relationships: []
      }
      worker_stats: {
        Row: {
          active_jobs: number | null
          applications_count: number | null
          id: string
          job_count: number | null
          total_commission: number | null
          total_revenue: number | null
          updated_at: string | null
          worker_id: string | null
        }
        Insert: {
          active_jobs?: number | null
          applications_count?: number | null
          id?: string
          job_count?: number | null
          total_commission?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          worker_id?: string | null
        }
        Update: {
          active_jobs?: number | null
          applications_count?: number | null
          id?: string
          job_count?: number | null
          total_commission?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worker_stats_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_status: {
        Row: {
          id: string
          is_online: boolean | null
          last_seen: string | null
          updated_at: string | null
          worker_id: string | null
        }
        Insert: {
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string | null
          worker_id?: string | null
        }
        Update: {
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worker_status_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: true
            referencedRelation: "worker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_total: {
        Args: { service_list: string[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
