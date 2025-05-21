/**
 * Stripe Checkout Server Actions
 *
 * This file contains server-side actions for handling Stripe checkout functionality.
 * It provides functions for creating checkout sessions and handling webhook events.
 *
 * Key responsibilities:
 * - Initialize Stripe with API keys
 * - Create checkout sessions with various configurations
 * - Process webhook events from Stripe
 * - Handle successful payments and store customer data
 *
 * Potential improvements:
 * 1. Add stronger type safety for webhook event handling
 * 2. Implement database integration for storing order information
 * 3. Add error logging service integration
 * 4. Implement idempotency keys for checkout session creation
 * 5. Add retry logic for failed API calls
 * 6. Implement more comprehensive webhook event handling
 * 7. Add metrics collection for checkout conversion rates
 * 8. Implement A/B testing for checkout flow
 * 9. Add support for additional payment methods
 * 10. Implement customer portal for subscription management
 * 11. Add support for promotional codes and discounts
 * 12. Implement tax calculation service integration
 * 13. Add support for multiple currencies
 * 14. Implement inventory management integration
 * 15. Add support for shipping calculation
 * 16. Implement fraud detection measures
 * 17. Add support for saved payment methods
 * 18. Implement customer email notifications
 * 19. Add support for digital product delivery
 * 20. Implement webhook signature verification
 * 21. Add support for recurring billing with variable amounts
 * 22. Implement customer segmentation for pricing
 * 23. Add support for split payments
 * 24. Implement invoice generation
 * 25. Add support for payment installments
 * 26. Implement dunning management for failed payments
 * 27. Add support for refunds and partial refunds
 * 28. Implement checkout abandonment recovery
 * 29. Add support for customer notes on orders
 * 30. Implement order status tracking
 * 31. Add support for gift cards
 * 32. Implement loyalty program integration
 * 33. Add support for customer account creation during checkout
 * 34. Implement address validation
 * 35. Add support for multiple shipping addresses
 * 36. Implement product bundling for checkout
 * 37. Add support for dynamic pricing
 * 38. Implement cart recovery emails
 * 39. Add support for order modifications after payment
 * 40. Implement checkout analytics
 * 41. Add support for customer service annotations
 * 42. Implement webhook event replay for testing
 * 43. Add support for custom checkout fields
 * 44. Implement GDPR compliance features
 * 45. Add support for tax exemptions
 * 46. Implement checkout localization
 * 47. Add support for multiple payment attempts
 * 48. Implement checkout session expiration handling
 * 49. Add support for checkout session recovery
 * 50. Implement customer identity verification
 * 51. Add support for 3D Secure authentication
 * 52. Implement strong customer authentication (SCA) compliance
 * 53. Add support for payment method restrictions by country
 * 54. Implement checkout performance monitoring
 * 55. Add support for custom success pages based on products
 * 56. Implement A/B testing for pricing display
 * 57. Add support for dynamic upsells during checkout
 * 58. Implement cart validation before checkout
 * 59. Add support for checkout continuation across devices
 * 60. Implement webhook event queuing for high volume
 * 61. Add support for customer-specific pricing
 * 62. Implement order batching for fulfillment
 * 63. Add support for checkout session sharing
 * 64. Implement custom payment flow for enterprise customers
 * 65. Add support for payment authorization holds
 * 66. Implement checkout session draft saving
 * 67. Add support for payment method surcharges
 * 68. Implement checkout flow customization by customer segment
 * 69. Add support for checkout prerequisites (e.g., terms acceptance)
 * 70. Implement webhook event archiving
 * 71. Add support for payment method recommendations
 * 72. Implement checkout session timeout handling
 * 73. Add support for payment method tokenization
 * 74. Implement checkout session resumption
 * 75. Add support for customer payment preferences
 * 76. Implement checkout session auditing
 * 77. Add support for payment method rotation
 * 78. Implement checkout session versioning
 * 79. Add support for payment orchestration
 * 80. Implement checkout session migration between accounts
 * 81. Add support for payment method testing in development
 * 82. Implement checkout session cloning
 * 83. Add support for payment method fallbacks
 * 84. Implement checkout session merging
 * 85. Add support for payment method validation rules
 * 86. Implement checkout session search functionality
 * 87. Add support for payment method metadata
 * 88. Implement checkout session analytics export
 * 89. Add support for payment method ranking
 * 90. Implement checkout session templates
 * 91. Add support for payment method feature detection
 * 92. Implement checkout session access controls
 * 93. Add support for payment method capability checking
 * 94. Implement checkout session rate limiting
 * 95. Add support for payment method selection optimization
 * 96. Implement checkout session debugging tools
 * 97. Add support for payment method filtering
 * 98. Implement checkout session monitoring alerts
 * 99. Add support for payment method scoring
 * 100. Implement checkout session health checks
 */

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
