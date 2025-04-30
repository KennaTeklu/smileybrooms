import { NextResponse } from "next/server"
import { handleStripeWebhook } from "@/lib/actions"

export async function POST(request: Request) {
  try {
    const result = await handleStripeWebhook(request)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
