import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    // Check payment status
    if (session.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        payment_status: session.payment_status,
        customer_email: session.customer_email,
        amount_total: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
      })
    } else {
      // Payment not completed
      let errorMessage = "Payment not completed"

      switch (session.payment_status) {
        case "unpaid":
          errorMessage = "Payment was not completed. Please try again or contact support."
          break
        case "no_payment_required":
          errorMessage = "No payment was required for this session."
          break
        default:
          errorMessage = `Payment status: ${session.payment_status}. Please contact support.`
      }

      return NextResponse.json({
        success: false,
        payment_status: session.payment_status,
        error: errorMessage,
      })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ success: false, error: `Stripe error: ${error.message}` }, { status: 400 })
    }

    return NextResponse.json(
      { success: false, error: "Internal server error while verifying payment" },
      { status: 500 },
    )
  }
}
