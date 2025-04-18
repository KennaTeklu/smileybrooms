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

// Update the CheckoutOptions type to include customer data
type CheckoutOptions = {
  lineItems: LineItem[]
  successUrl: string
  cancelUrl: string
  priceId?: string // For backward compatibility
  customLineItems?: Array<{
    name: string
    amount: number
    quantity: number
    metadata?: Record<string, any>
  }>
  customerEmail?: string
  customerData?: {
    name?: string
    email?: string
    phone?: string
    address?: {
      line1?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  }
}

export async function createCheckoutSession(options: CheckoutOptions) {
  const { lineItems, successUrl, cancelUrl, priceId, customLineItems, customerEmail, customerData } = options

  try {
    // Create a checkout session with Stripe
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ["card"],
      billing_address_collection: "auto",
    }

    // Add customer data if provided
    if (customerEmail) {
      sessionParams.customer_email = customerEmail
    }

    // Add shipping address if provided
    if (customerData?.address) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ["US"],
      }

      // Pre-fill shipping details if we have them
      if (customerData.name || customerData.phone) {
        sessionParams.shipping_options = [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 0,
                currency: "usd",
              },
              display_name: "Standard Service",
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: 1,
                },
                maximum: {
                  unit: "business_day",
                  value: 3,
                },
              },
            },
          },
        ]
      }
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
        const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.amount * 100), // Convert to cents
          },
          quantity: item.quantity,
        }

        // Add metadata to the line item if provided
        if (item.metadata) {
          lineItem.price_data!.product_data!.metadata = {}

          // Convert complex objects to strings
          Object.entries(item.metadata).forEach(([key, value]) => {
            if (typeof value === "object") {
              lineItem.price_data!.product_data!.metadata![key] = JSON.stringify(value)
            } else {
              lineItem.price_data!.product_data!.metadata![key] = String(value)
            }
          })
        }

        sessionParams.line_items!.push(lineItem)
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

      // Store customer data from metadata if available
      if (session.metadata && session.metadata.customerData) {
        try {
          const customerData = JSON.parse(session.metadata.customerData)
          // Save customer data to your database
          // await db.customer.upsert({
          //   where: { email: customerData.email },
          //   update: { ...customerData },
          //   create: { ...customerData }
          // })
        } catch (error) {
          console.error("Error parsing customer data:", error)
        }
      }

      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return { received: true }
}
