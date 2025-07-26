import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    })

    if (!session) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    // Check if payment was successful
    if (session.payment_status === "paid" && session.status === "complete") {
      return NextResponse.json({
        success: true,
        status: "complete",
        sessionId: session.id,
        orderData: {
          id: session.id,
          amount: session.amount_total,
          currency: session.currency,
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
          paymentStatus: session.payment_status,
          createdAt: new Date(session.created * 1000).toISOString(),
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        status: session.status,
        error: `Payment status: ${session.payment_status}, Session status: ${session.status}`,
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Payment verification failed",
      },
      { status: 500 },
    )
  }
}
