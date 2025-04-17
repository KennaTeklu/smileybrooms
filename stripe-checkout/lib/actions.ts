"use server"
import Stripe from "stripe"
import { headers } from "next/headers"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

type LineItem = {
  price: string
  quantity: number
}

// Update the CheckoutOptions type to include an optional customLineItems array
type CheckoutOptions = {
  lineItems: LineItem[]
  successUrl: string
  cancelUrl: string
  priceId?: string // For backward compatibility
  customLineItems?: Array<{
    name: string
    amount: number
    quantity: number
  }>
}

export async function createCheckoutSession(options: CheckoutOptions) {
  const { lineItems, successUrl, cancelUrl, priceId, customLineItems } = options

  try {
    // Create a checkout session with Stripe
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ["card"],
      billing_address_collection: "auto",
    }

    // Add regular line items if they exist
    if (lineItems.length > 0 || priceId) {
      sessionParams.line_items = lineItems.length > 0 ? lineItems : priceId ? [{ price: priceId, quantity: 1 }] : []
    }

    // Add custom line items if they exist
    if (customLineItems && customLineItems.length > 0) {
      // If we have custom line items, we need to use the price_data approach
      sessionParams.line_items = sessionParams.line_items || []

      customLineItems.forEach((item) => {
        sessionParams.line_items!.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.amount * 100), // Convert to cents
          },
          quantity: item.quantity,
        })
      })
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    // Return the URL to redirect to
    return session.url
  } catch (error) {
    console.error("Stripe checkout error:", error)
    throw new Error("Failed to create checkout session")
  }
}

// This function will be used by the webhook route handler
export async function handleStripeWebhook(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return { error: "Webhook signature verification failed" }
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session

      // Here you would typically:
      // 1. Match the session to a customer in your database
      // 2. Fulfill the order (grant access to product, etc.)
      console.log("Payment successful for session:", session.id)

      // Example: Update your database to mark the order as paid
      // await db.order.update({
      //   where: { stripeSessionId: session.id },
      //   data: { status: "paid" }
      // })

      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return { received: true }
}
