"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error("Sign up error:", error.message)
    return { success: false, message: error.message }
  }

  return { success: true, message: "Check your email to confirm your account." }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign in error:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/dashboard")
}

export async function signOut() {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Sign out error:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/login")
}
