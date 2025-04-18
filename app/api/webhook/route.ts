import { NextResponse } from "next/server"
import { handleStripeWebhook } from "@/lib/actions"

export async function POST(request: Request) {
  try {
    const result = await handleStripeWebhook(request)

    if (result.error) {
      console.error("Webhook error:", result.error)
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ received: true, type: result.type })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// Disable body parsing for the webhook route
export const config = {
  api: {
    bodyParser: false,
  },
}
