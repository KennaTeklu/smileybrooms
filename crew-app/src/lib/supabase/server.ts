import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export function getSupabaseServerClient() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.")
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      // This is for server-side authentication, typically used with JWTs
      // For this project, we're using a simplified approach for cleaner login
      // and direct service role key for API routes.
      // In a full app, you'd manage user sessions more robustly.
      persistSession: false,
    },
  })
}
