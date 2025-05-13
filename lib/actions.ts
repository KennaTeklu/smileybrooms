"use server"

import Stripe from "stripe"

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

type LineItem = {
  price: string
  quantity: number
}

type CustomLineItem = {
  name: string
  amount: number
  quantity: number
  metadata?: Record<string, any>
}

type CheckoutSessionParams = {
  lineItems?: LineItem[]
  customLineItems?: CustomLineItem[]
  successUrl: string
  cancelUrl: string
  isRecurring?: boolean
  recurringInterval?: "week" | "month" | "year"
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

export async function createCheckoutSession({
  lineItems,
  customLineItems,
  successUrl,
  cancelUrl,
  isRecurring = false,
  recurringInterval = "month",
  customerData,
}: CheckoutSessionParams): Promise<string> {
  try {
    // Prepare line items for the checkout session
    let sessionLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    // Add standard line items if provided
    if (lineItems && lineItems.length > 0) {
      sessionLineItems = lineItems.map((item) => ({
        price: item.price,
        quantity: item.quantity,
      }))
    }

    // Add custom line items if provided
    if (customLineItems && customLineItems.length > 0) {
      const customItems = customLineItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            metadata: item.metadata || {},
          },
          unit_amount: Math.round(item.amount * 100), // Convert to cents
          recurring: isRecurring
            ? {
                interval: recurringInterval as Stripe.PriceData.Recurring.Interval,
              }
            : undefined,
        },
        quantity: item.quantity,
      }))

      sessionLineItems = [...sessionLineItems, ...customItems]
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: sessionLineItems,
      mode: isRecurring ? "subscription" : "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_creation: "always",
      billing_address_collection: "auto",
      shipping_address_collection: customerData?.address
        ? {
            allowed_countries: ["US", "CA", "GB"],
          }
        : undefined,
      customer_email: customerData?.email,
      phone_number_collection: customerData?.phone
        ? {
            enabled: true,
          }
        : undefined,
    })

    return session.url || ""
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function handleStripeWebhook(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature") || ""
    const body = await request.text()

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return { error: "Missing Stripe webhook secret" }
    }

    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        // Process the successful payment
        await processSuccessfulPayment(session)
        break

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Handle successful payment intent
        console.log(`Payment intent ${paymentIntent.id} succeeded`)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error handling webhook:", error)
    return { error: "Failed to handle webhook" }
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
