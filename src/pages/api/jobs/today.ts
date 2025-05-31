import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redis } from "@/lib/redis"
import { formatISO, startOfDay, endOfDay } from "date-fns"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  // In a real app, you'd get the cleaner_id from a session/JWT token
  const cleanerId = 1 // Placeholder for cleaner ID

  if (!cleanerId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const supabase = getSupabaseServerClient()

  try {
    // Try to fetch from Redis cache first
    const cacheKey = `jobs:today:${cleanerId}`
    const cachedJobs = await redis.get(cacheKey)
    if (cachedJobs) {
      return res.status(200).json({ jobs: JSON.parse(cachedJobs as string), fromCache: true })
    }

    const todayStart = formatISO(startOfDay(new Date()))
    const todayEnd = formatISO(endOfDay(new Date()))

    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("cleaner_id", cleanerId)
      .gte("start_time", todayStart)
      .lte("start_time", todayEnd)
      .order("start_time", { ascending: true })

    if (error) {
      console.error("Error fetching today's jobs:", error)
      return res.status(500).json({ error: "Failed to retrieve jobs." })
    }

    // Cache the result in Redis for 60 seconds
    await redis.setex(cacheKey, 60, JSON.stringify(jobs))

    res.status(200).json({ jobs })
  } catch (error) {
    console.error("API Get Today Jobs Error:", error)
    res.status(500).json({ error: "Internal server error." })
  }
}
