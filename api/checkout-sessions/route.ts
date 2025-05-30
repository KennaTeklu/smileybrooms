import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import type Stripe from "stripe"

export async function POST(req: Request) {
  try {
    const { lineItems, mode, customerEmail, metadata, subscriptionData } = await req.json()

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return new NextResponse("Line items are required", { status: 400 })
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: mode || "payment", // 'payment' or 'subscription'
      line_items: lineItems.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100), // Price in cents
          ...(mode === "subscription" && item.recurring ? { recurring: { interval: item.recurring.interval } } : {}),
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/canceled`,
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      billing_address_collection: "auto",
      metadata: metadata || {},
    }

    if (customerEmail) {
      sessionParams.customer_email = customerEmail
    }

    if (mode === "subscription" && subscriptionData) {
      sessionParams.subscription_data = {
        trial_period_days: subscriptionData.trial_period_days,
        cancel_at_period_end: subscriptionData.cancel_at_period_end,
        // Add more subscription_data fields as needed, e.g., billing_cycle_anchor, proration_behavior
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 })
  }
}
