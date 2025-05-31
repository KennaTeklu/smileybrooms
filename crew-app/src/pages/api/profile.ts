import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/crew-app/src/lib/supabase/server"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  // In a real app, you'd get the cleanerId from an authenticated session/token
  // For now, we'll use a placeholder (e.g., cleanerId 1)
  const cleanerId = 1 // Replace with actual cleaner ID from session

  if (!cleanerId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { name, phone, vehicle_make, vehicle_model, vehicle_color, payment_preference } = req.body

  try {
    const supabase = getSupabaseServerClient()

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

    if (error) {
      console.error("Error updating cleaner profile:", error)
      return res.status(500).json({ error: "Failed to update profile." })
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Cleaner not found." })
    }

    res.status(200).json({ message: "Profile updated successfully!", profile: data[0] })
  } catch (error) {
    console.error("Server error during profile update:", error)
    res.status(500).json({ error: "Internal server error." })
  }
}
