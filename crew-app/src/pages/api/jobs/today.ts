import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/crew-app/src/lib/supabase/server"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  // In a real app, you'd get the cleanerId from an authenticated session/token
  // For now, we'll use a placeholder or assume a cleaner is logged in.
  // Let's assume cleanerId 1 for demonstration purposes.
  const cleanerId = 1 // Replace with actual cleaner ID from session

  if (!cleanerId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const supabase = getSupabaseServerClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("id, address, start_time, checklist, client_notes, status")
      .eq("cleaner_id", cleanerId)
      .gte("start_time", today.toISOString())
      .lt("start_time", tomorrow.toISOString())
      .order("start_time", { ascending: true })

    if (error) {
      console.error("Error fetching today's jobs:", error)
      return res.status(500).json({ error: "Failed to fetch jobs." })
    }

    res.status(200).json({ jobs })
  } catch (error) {
    console.error("Server error fetching today's jobs:", error)
    res.status(500).json({ error: "Internal server error." })
  }
}
