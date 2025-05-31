/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../../src/types/supabase'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type UserRole = Database['public']['Tables']['profiles']['Row']['role']

interface CreateUserPayload {
  email: string
  password: string
  role: UserRole
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with admin privileges
    const supabaseAdmin = createClient<Database>(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    const { users } = await req.json() as { users: CreateUserPayload[] }
    const createdUsers: Array<{ id: string; email: string; role: UserRole }> = []
    const errors: { user: string; error: string }[] = []

    for (const user of users) {
      try {
        const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        })

        if (createError) throw createError

        if (data?.user) {
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: user.email,
              role: user.role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (profileError) throw profileError
          createdUsers.push({ 
            id: data.user.id,
            email: data.user.email || user.email,
            role: user.role 
          })
        }
      } catch (err: unknown) {
        const error = err as Error
        errors.push({ user: user.email, error: error.message })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: errors.length === 0,
        created: createdUsers,
        errors
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (err: unknown) {
    const error = err as Error
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
