import type { NextApiRequest, NextApiResponse } from "next"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import {
  randombytes_buf,
  from_base64,
  to_base64,
  ready,
  crypto_pwhash_SALTBYTES,
  crypto_pwhash_OPSLIMIT_MODERATE,
  crypto_pwhash_MEMLIMIT_MODERATE,
  crypto_pwhash_ALG_ARGON2ID13,
} from "libsodium-wrappers"
import twilio from "twilio"

// Initialize libsodium (important for server-side hashing)
ready.then(() => {
  console.log("libsodium is ready.")
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { phone } = req.body

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required." })
  }

  const supabase = getSupabaseServerClient()

  try {
    // 1. Verify cleaner exists
    const { data: cleaner, error: cleanerError } = await supabase
      .from("cleaners")
      .select("id")
      .eq("phone", phone)
      .single()

    if (cleanerError || !cleaner) {
      console.error("PIN reset - cleaner not found:", cleanerError)
      return res.status(404).json({ error: "Phone number not found." })
    }

    // 2. Generate a new random PIN (e.g., 6 digits)
    const newPin = Math.floor(100000 + Math.random() * 900000).toString()

    // 3. Hash the new PIN using libsodium
    await ready // Ensure libsodium is ready
    const salt = randombytes_buf(crypto_pwhash_SALTBYTES)
    const pinHash = to_base64(
      from_base64(newPin),
      salt,
      crypto_pwhash_OPSLIMIT_MODERATE,
      crypto_pwhash_MEMLIMIT_MODERATE,
      crypto_pwhash_ALG_ARGON2ID13,
    )

    // 4. Update the cleaner's PIN hash in the database
    const { error: updateError } = await supabase.from("cleaners").update({ pin_hash: pinHash }).eq("id", cleaner.id)

    if (updateError) {
      console.error("PIN reset - DB update error:", updateError)
      return res.status(500).json({ error: "Failed to update PIN in database." })
    }

    // 5. Send the new PIN via Twilio SMS
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error("Twilio environment variables not set.")
      return res.status(500).json({ error: "Twilio configuration missing." })
    }

    const client = twilio(accountSid, authToken)

    await client.messages.create({
      body: `Your new Cleaner Portal PIN is: ${newPin}. Please log in and consider changing it.`,
      from: twilioPhoneNumber,
      to: phone,
    })

    res.status(200).json({ message: "New PIN sent via SMS." })
  } catch (error) {
    console.error("API PIN Reset Error:", error)
    res.status(500).json({ error: "Internal server error during PIN reset." })
  }
}
