import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  try {
    const { items, success_url, cancel_url } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Validate required parameters
    if (!success_url) {
      return NextResponse.json({ error: "success_url is required" }, { status: 400 })
    }

    if (!cancel_url) {
      return NextResponse.json({ error: "cancel_url is required" }, { status: 400 })
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: success_url || `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/canceled`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Stripe checkout error:", error)

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      const errorMessage = error.message || "Payment processing error"
      const errorType = error.type || "unknown"

      return NextResponse.json(
        {
          error: "Error creating checkout session",
          message: errorMessage,
          type: errorType,
          code: error.statusCode || 500,
        },
        { status: error.statusCode || 500 },
      )
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: "Error creating checkout session",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
