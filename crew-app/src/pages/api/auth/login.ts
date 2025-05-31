import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/crew-app/src/lib/supabase/server"
import { redis } from "@/crew-app/src/lib/redis"
import { verify } from "libsodium-wrappers" // libsodium for PIN hashing

// In a real app, you'd use a proper session management library
// and implement rate limiting (e.g., using @upstash/ratelimit)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { phone, pin } = req.body

  if (!phone || !pin) {
    return res.status(400).json({ error: "Phone and PIN are required." })
  }

  const supabase = getSupabaseServerClient()

  try {
    // Rate limiting (conceptual - implement with @upstash/ratelimit in production)
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
    const rateLimitKey = `login_attempt:${ip}`
    const attempts = await redis.incr(rateLimitKey)
    await redis.expire(rateLimitKey, 5) // 5 seconds window

    if (attempts > 5) {
      // 5 requests per 5 seconds
      return res.status(429).json({ error: "Too many login attempts. Please try again later." })
    }

    const { data, error } = await supabase.from("cleaners").select("id, pin_hash").eq("phone", phone).single()

    if (error || !data) {
      console.error("Login error:", error)
      return res.status(401).json({ error: "Invalid phone number or PIN." })
    }

    // Verify PIN using libsodium
    // In a real app, ensure libsodium is initialized
    const isPinValid = await verify(
      Buffer.from(data.pin_hash, "base64"), // Stored hash
      Buffer.from(pin), // User provided PIN
    )

    if (!isPinValid) {
      return res.status(401).json({ error: "Invalid phone number or PIN." })
    }

    // Successful login
    // In a real app, create a JWT token and set it as an HttpOnly cookie
    res.status(200).json({ message: "Login successful", cleanerId: data.id })
  } catch (error) {
    console.error("API Login Error:", error)
    res.status(500).json({ error: "Internal server error." })
  }
}
