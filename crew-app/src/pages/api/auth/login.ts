import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/crew-app/src/lib/supabase/server"
import libsodium from "libsodium-wrappers"
import { getRedisClient } from "@/crew-app/src/lib/redis"

// Simple rate limiting middleware
const rateLimit = async (ip: string) => {
  const redis = getRedisClient()
  const key = `ratelimit:${ip}`
  const requests = await redis.incr(key)
  if (requests === 1) {
    await redis.expire(key, 1) // Set expiry to 1 second
  }
  return requests > 5 // 5 requests per second limit
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress
  if (typeof clientIp === "string" && (await rateLimit(clientIp))) {
    return res.status(429).json({ error: "Too Many Requests" })
  }

  const { phone, pin } = req.body

  if (!phone || !pin) {
    return res.status(400).json({ error: "Phone and PIN are required." })
  }

  try {
    await libsodium.ready // Ensure libsodium is ready

    const supabase = getSupabaseServerClient()
    const { data: cleaner, error } = await supabase.from("cleaners").select("id, pin_hash").eq("phone", phone).single()

    if (error || !cleaner) {
      console.error("Login error: Cleaner not found or DB error", error)
      return res.status(401).json({ error: "Invalid phone number or PIN." })
    }

    // Verify PIN
    const isPinValid = await libsodium.crypto_pwhash_str_verify(cleaner.pin_hash, pin)

    if (!isPinValid) {
      return res.status(401).json({ error: "Invalid phone number or PIN." })
    }

    // In a real application, you would generate and return a JWT here
    // For this example, we'll just return success
    res.status(200).json({ message: "Login successful!", cleanerId: cleaner.id })
  } catch (error) {
    console.error("Server error during login:", error)
    res.status(500).json({ error: "Internal server error." })
  }
}
