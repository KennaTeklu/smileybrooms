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
    name: string
    email: string
    phone: string
    address: {
      line1: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  }
}

export async function createCheckoutSession({
  lineItems = [],
  customLineItems = [],
  successUrl,
  cancelUrl,
  customerEmail,
  customerData,
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
        unit_amount: item.amount,
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
    const session = await stripe.checkout.sessions.create({
      line_items: allLineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: !customerId ? customerEmail : undefined,
      customer: customerId,
      metadata: {
        customData: JSON.stringify(customLineItems.map((item) => item.metadata || {})),
      },
    })

    return session.url || cancelUrl
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function handleStripeWebhook(payload: any, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error("Missing Stripe webhook secret")
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

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
    throw new Error("Failed to handle webhook")
  }
}

async function processSuccessfulPayment(session: Stripe.Checkout.Session) {
  // Here you would typically:
  // 1. Update your database with the order details
  // 2. Send confirmation emails
  // 3. Trigger any other business logic

  console.log(`Processing payment for session ${session.id}`)

  // Example: Extract custom data from metadata
  if (session.metadata?.customData) {
    try {
      const customData = JSON.parse(session.metadata.customData)
      console.log("Custom data:", customData)
    } catch (error) {
      console.error("Error parsing custom data:", error)
    }
  }
}
