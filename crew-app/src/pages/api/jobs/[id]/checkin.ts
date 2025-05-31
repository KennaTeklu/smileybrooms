import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/crew-app/src/lib/supabase/server"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { id } = req.query // Job ID from URL
  const { jobId } = req.body // Job ID from body (for consistency, though query param is primary)

  if (!id) {
    return res.status(400).json({ error: "Job ID is required." })
  }

  // In a real app, verify cleaner's session/JWT and if they are assigned to this job
  const cleanerId = 1 // Placeholder

  const supabase = getSupabaseServerClient()

  try {
    // Update job status to 'checked_in' or record check-in time
    // Assuming a 'status' column or 'checkin_time' column in the jobs table
    const { data, error } = await supabase
      .from("jobs")
      .update({ status: "checked_in", checkin_time: new Date().toISOString() }) // Add checkin_time column to jobs table
      .eq("id", id)
      .eq("cleaner_id", cleanerId) // Ensure cleaner is assigned to this job
      .select()
      .single()

    if (error || !data) {
      console.error("Check-in error:", error)
      return res.status(500).json({ error: "Failed to check in. Job not found or not assigned to you." })
    }

    res.status(200).json({ message: "Checked in successfully!", job: data })
  } catch (error) {
    console.error("API Check-in Error:", error)
    res.status(500).json({ error: "Internal server error." })
  }
}
