"use server"

import Stripe from "stripe"

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

type CheckoutSessionParams = {
  lineItems?: Array<{
    price: string
    quantity: number
  }>
  customLineItems?: Array<{
    name: string
    amount: number
    quantity: number
    metadata?: Record<string, any>
  }>
  successUrl: string
  cancelUrl: string
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
  isRecurring?: boolean
  recurringInterval?: "week" | "month" | "year"
}

export async function createCheckoutSession({
  lineItems = [],
  customLineItems = [],
  successUrl,
  cancelUrl,
  customerEmail,
  customerData,
  isRecurring = false,
  recurringInterval = "month",
}: CheckoutSessionParams): Promise<string> {
  try {
    // Create standard line items for products with price IDs
    const standardLineItems = lineItems.map((item) => ({
      price: item.price,
      quantity: item.quantity,
    }))

    // Create custom line items for products without price IDs
    const customPriceLineItems = customLineItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          metadata: item.metadata || {},
        },
        unit_amount: Math.round(item.amount * 100), // Convert to cents for Stripe
        ...(isRecurring
          ? {
              recurring: {
                interval: recurringInterval as "week" | "month" | "year",
              },
            }
          : {}),
      },
      quantity: item.quantity,
    }))

    // Combine all line items
    const allLineItems = [...standardLineItems, ...customPriceLineItems]

    // Create a customer if customer data is provided
    let customerId: string | undefined = undefined
    if (customerData) {
      const customer = await stripe.customers.create({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
      })
      customerId = customer.id
    }

    // Create the checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: allLineItems,
      mode: isRecurring ? "subscription" : "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: !customerId ? customerEmail : undefined,
      customer: customerId,
      metadata: {
        customData: JSON.stringify(customLineItems.map((item) => item.metadata || {})),
      },
      billing_address_collection: "auto",
      payment_method_types: ["card"],
    }

    // Add shipping address collection if customer data has address
    if (customerData?.address) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ["US"],
      }

      // Add shipping options
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

    const session = await stripe.checkout.sessions.create(sessionParams)

    return session.url || cancelUrl
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function handleStripeWebhook(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature") as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      return { error: `Webhook signature verification failed: ${err.message}` }
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        // Handle successful payment
        console.log("Payment successful for session:", session.id)
        // Here you would typically:
        // 1. Update order status in your database
        // 2. Send confirmation email to customer
        // 3. Schedule the cleaning service
        break

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment intent succeeded:", paymentIntent.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error in handleStripeWebhook:", error)
    throw error
  }
}

async function processSuccessfulPayment(session: Stripe.Checkout.Session) {
  // Here you would typically:
  // 1. Update your database with the order details
  // 2. Send confirmation emails
  // 3. Trigger any other business logic

  console.log(`Processing payment for session ${session.id}`)

  // Store customer data from metadata if available
  if (session.metadata?.customData) {
    try {
      const customData = JSON.parse(session.metadata.customData)
      console.log("Custom data:", customData)

      // Here you could save customer data to your database
      // For example:
      // await db.customer.upsert({
      //   where: { email: customerData.email },
      //   update: { ...customerData },
      //   create: { ...customerData }
      // })
    } catch (error) {
      console.error("Error parsing custom data:", error)
    }
  }

  // You can add additional processing logic here
}
