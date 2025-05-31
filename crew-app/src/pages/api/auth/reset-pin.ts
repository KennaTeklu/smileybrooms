import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/crew-app/src/lib/supabase/server"
import libsodium from "libsodium-wrappers"
import twilio from "twilio"
import { getRedisClient } from "@/crew-app/src/lib/redis"

// Simple rate limiting middleware
const rateLimit = async (ip: string) => {
  const redis = getRedisClient()
  const key = `ratelimit:reset-pin:${ip}`
  const requests = await redis.incr(key)
  if (requests === 1) {
    await redis.expire(key, 60) // 1 request per minute for PIN reset
  }
  return requests > 1
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress
  if (typeof clientIp === "string" && (await rateLimit(clientIp))) {
    return res.status(429).json({ error: "Too Many Requests. Try again in a minute." })
  }

  const { phone } = req.body

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required." })
  }

  try {
    await libsodium.ready // Ensure libsodium is ready

    const supabase = getSupabaseServerClient()
    const { data: cleaner, error: cleanerError } = await supabase
      .from("cleaners")
      .select("id")
      .eq("phone", phone)
      .single()

    if (cleanerError || !cleaner) {
      console.error("PIN reset error: Cleaner not found", cleanerError)
      return res.status(404).json({ error: "Phone number not registered." })
    }

    // Generate a new random PIN (e.g., 6 digits)
    const newPin = Math.floor(100000 + Math.random() * 900000).toString()
    const newPinHash = await libsodium.crypto_pwhash_str(
      newPin,
      libsodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      libsodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    )

    // Update cleaner's PIN hash in the database
    const { error: updateError } = await supabase.from("cleaners").update({ pin_hash: newPinHash }).eq("id", cleaner.id)

    if (updateError) {
      console.error("PIN reset error: DB update failed", updateError)
      return res.status(500).json({ error: "Failed to reset PIN. Please try again." })
    }

    // Send PIN via Twilio SMS
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER // Your Twilio phone number

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error("Twilio environment variables not set.")
      return res.status(500).json({ error: "Twilio service not configured." })
    }

    const client = twilio(accountSid, authToken)
    await client.messages.create({
      body: `Your new SmileyBrooms Cleaner Portal PIN is: ${newPin}`,
      from: twilioPhoneNumber,
      to: phone,
    })

    res.status(200).json({ message: "New PIN sent via SMS." })
  } catch (error) {
    console.error("Server error during PIN reset:", error)
    res.status(500).json({ error: "Internal server error." })
  }
}
