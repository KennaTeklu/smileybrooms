"use server"

import Stripe from "stripe"

// Initialize Stripe with the secret key and latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16", // Using the latest stable API version
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
  isRecurring?: boolean
  recurringInterval?: "week" | "month" | "year"
  paymentMethod?: "card" | "bank" | "both"
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
  paymentMethod = "both",
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
                interval: recurringInterval === "week" ? "week" : recurringInterval === "year" ? "year" : "month",
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

    // Determine payment method types based on selection
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = []

    if (paymentMethod === "both" || paymentMethod === "card") {
      paymentMethodTypes.push("card")
    }

    if (paymentMethod === "both" || paymentMethod === "bank") {
      paymentMethodTypes.push("us_bank_account")
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
      payment_method_types: paymentMethodTypes,
      payment_intent_data: !isRecurring
        ? {
            setup_future_usage: "off_session",
          }
        : undefined,
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
        await processSuccessfulPaymentIntent(paymentIntent)
        break

      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
        // Handle failed payment intent
        console.error(
          `Payment failed for intent ${failedPaymentIntent.id}: ${failedPaymentIntent.last_payment_error?.message || "Unknown error"}`,
        )
        break

      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription
        // Handle new subscription
        console.log(`New subscription created: ${subscription.id}`)
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription
        // Handle subscription update
        console.log(`Subscription updated: ${updatedSubscription.id}`)
        break

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription
        // Handle subscription cancellation
        console.log(`Subscription cancelled: ${deletedSubscription.id}`)
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

async function processSuccessfulPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Processing successful payment intent ${paymentIntent.id}`)

  // Extract payment method details
  const paymentMethodId = paymentIntent.payment_method

  if (paymentMethodId) {
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId as string)
      console.log(`Payment method type: ${paymentMethod.type}`)

      // Handle different payment method types
      if (paymentMethod.type === "us_bank_account") {
        // Handle ACH payment
        console.log("ACH payment processed successfully")
      } else if (paymentMethod.type === "card") {
        // Handle card payment
        console.log("Card payment processed successfully")
      }
    } catch (error) {
      console.error("Error retrieving payment method:", error)
    }
  }

  // Additional processing as needed
}
