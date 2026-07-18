import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const isHttpUrl = supabaseUrl && /^https?:\/\//i.test(supabaseUrl)

if (!isHttpUrl || !supabaseKey) {
  console.warn('⚠ SUPABASE_URL (HTTP) or SUPABASE_KEY not set. Database features will not work.')
  console.warn('  Set SUPABASE_URL to https://<project>.supabase.co (not a postgres:// URL)')
}

export const supabase = isHttpUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export function requireDb() {
  if (!supabase) {
    throw new Error('Database not configured. Set SUPABASE_URL and SUPABASE_KEY.')
  }
  return supabase
}
