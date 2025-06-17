import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server-side operations
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Server Action.
            // This error is typically not an issue if you're using `createServerClient` correctly.
            console.warn("Could not set cookie from server:", error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            console.warn("Could not remove cookie from server:", error)
          }
        },
      },
    },
  )
}

// New function to get user with profile role
export async function getUserWithRole() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, role: null }
  }

  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching user profile:", error.message)
    return { user, role: null }
  }

  return { user, role: profile?.role || "user" }
}
