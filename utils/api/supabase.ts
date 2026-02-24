import 'server-only'

import { createClient } from '@supabase/supabase-js'

function requireEnv(key: 'SUPABASE_URL' | 'SUPABASE_SERVICE_ROLE_KEY'): string {
  const value = process.env[key]?.trim()

  if (!value) {
    throw new Error(`[supabase] Missing required env: ${key}`)
  }

  return value
}

export function createSupabaseServiceRoleClient() {
  const supabaseUrl = requireEnv('SUPABASE_URL')
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
