import { createClient } from "@supabase/supabase-js"

export function getSupabaseClient() {
  // Create a single supabase client for the client-side
  // This is a singleton pattern to prevent multiple client instances
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.")
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
