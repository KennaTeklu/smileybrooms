import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ message: "Session ID is required" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      // Payment was successful
      // You might want to update your database here, fulfill the order, etc.
      console.log(`Payment successful for session: ${sessionId}`)
      return NextResponse.json(
        {
          status: "paid",
          message: "Payment successfully verified.",
          orderId: session.id, // Or your internal order ID
          customerEmail: session.customer_details?.email,
          amount: session.amount_total,
        },
        { status: 200 },
      )
    } else {
      // Payment not yet paid or failed
      console.log(`Payment status for session ${sessionId}: ${session.payment_status}`)
      return NextResponse.json(
        {
          status: session.payment_status,
          message: `Payment status is ${session.payment_status}.`,
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Error verifying payment session:", error)
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 })
  }
}
