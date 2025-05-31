import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  // In a real app, get cleanerId from authenticated session/JWT
  const cleanerId = 1 // Placeholder

  if (!cleanerId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { name, phone, vehicle_make, vehicle_model, vehicle_color, payment_preference } = req.body

  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase
      .from("cleaners")
      .update({
        name,
        phone,
        vehicle_make,
        vehicle_model,
        vehicle_color,
        payment_preference,
      })
      .eq("id", cleanerId)
      .select()
      .single()

    if (error || !data) {
      console.error("Profile update error:", error)
      return res.status(500).json({ error: "Failed to update profile." })
    }

    res.status(200).json({ message: "Profile updated successfully!", profile: data })
  } catch (error) {
    console.error("API Profile Update Error:", error)
    res.status(500).json({ error: "Internal server error." })
  }
}
