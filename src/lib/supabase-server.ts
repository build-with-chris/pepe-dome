/**
 * Server-side Supabase client for Storage (uploads).
 * Uses service role key – only use in API routes, never expose to the client.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })
}

/** Default bucket name for uploads (create this bucket in Supabase Dashboard and set to public) */
export const UPLOAD_BUCKET = 'uploads'
