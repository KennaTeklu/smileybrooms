import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/crew-app/src/lib/supabase/server"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { id } = req.query // Job ID from URL parameter
  const { jobId } = req.body // Job ID from body (redundant but kept for consistency with client)

  const targetJobId = id || jobId

  if (!targetJobId) {
    return res.status(400).json({ error: "Job ID is required." })
  }

  // In a real app, verify cleaner's authorization for this job
  // const cleanerId = ... // Get from session/token

  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("jobs")
      .update({ status: "checked_in", checkin_time: new Date().toISOString() })
      .eq("id", targetJobId)
      .select() // Select the updated row to confirm

    if (error) {
      console.error("Error updating job status:", error)
      return res.status(500).json({ error: "Failed to check in." })
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Job not found or already checked in." })
    }

    res.status(200).json({ message: "Checked in successfully!", job: data[0] })
  } catch (error) {
    console.error("Server error during check-in:", error)
    res.status(500).json({ error: "Internal server error." })
  }
}
