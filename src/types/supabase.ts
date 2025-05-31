import type { Database as GeneratedDatabase } from './database'

export interface ProfilesTable {
  id: string
  name: string | null
  role: 'admin' | 'agent' | 'driver' | 'helper' | 'cleaner' | 'customer'
  email: string
  created_at: string
  updated_at: string
}

export interface Database extends GeneratedDatabase {
  public: {
    Tables: {
      profiles: {
        Row: ProfilesTable
        Insert: Partial<ProfilesTable>
        Update: Partial<ProfilesTable>
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    } & GeneratedDatabase['public']['Tables']
    Views: GeneratedDatabase['public']['Views']
    Functions: GeneratedDatabase['public']['Functions']
    Enums: GeneratedDatabase['public']['Enums']
    CompositeTypes: GeneratedDatabase['public']['CompositeTypes']
  }
}
