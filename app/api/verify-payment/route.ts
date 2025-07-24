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
      return NextResponse.json({ success: false, error: "No session ID provided" }, { status: 400 })
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"],
    })

    // Check payment status
    const isPaymentSuccessful = session.payment_status === "paid"

    return NextResponse.json({
      success: isPaymentSuccessful,
      payment_status: session.payment_status,
      session_id: session.id,
      amount_total: session.amount_total,
      amount_tax: session.amount_tax,
      currency: session.currency,
      customer_details: session.customer_details,
      line_items: session.line_items?.data?.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        amount: item.amount_total,
      })),
      payment_method_types: session.payment_method_types,
      metadata: session.metadata,
      created: session.created,
      error: !isPaymentSuccessful ? "Payment was not completed successfully" : null,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          success: false,
          error: `Payment verification failed: ${error.message}`,
          payment_status: "unknown",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to verify payment status",
        payment_status: "unknown",
      },
      { status: 500 },
    )
  }
}
