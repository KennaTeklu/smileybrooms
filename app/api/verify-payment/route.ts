import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json({ success: false, error: "Payment system not configured" }, { status: 500 })
    }

    // Initialize Stripe (only if available)
    let stripe
    try {
      const Stripe = (await import("stripe")).default
      stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2024-06-20",
      })
    } catch (error) {
      return NextResponse.json({ success: false, error: "Payment system unavailable" }, { status: 500 })
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        session: {
          id: session.id,
          amount_total: session.amount_total,
          customer_details: session.customer_details,
          payment_method_types: session.payment_method_types,
          payment_status: session.payment_status,
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        error: `Payment not completed. Status: ${session.payment_status}`,
      })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ success: false, error: "Failed to verify payment" }, { status: 500 })
  }
}
