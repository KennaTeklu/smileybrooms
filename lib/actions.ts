"use server"

import Stripe from "stripe"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
})

export type LineItem = {
  price: string
  quantity: number
}

export type CustomLineItem = {
  name: string
  description?: string
  amount: number
  quantity: number
  tax_rates?: string[]
  images?: string[]
}

export type CheckoutOptions = {
  lineItems?: LineItem[]
  customLineItems?: CustomLineItem[]
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
  customerEmail?: string
  clientReferenceId?: string
  promotionCode?: string
  allowPromotionCodes?: boolean
  shippingAddressCollection?: boolean
  taxIdCollection?: boolean
}

/**
 * Creates a Stripe checkout session for payment processing
 *
 * @param options - Configuration options for the checkout session
 * @returns URL to the Stripe checkout page
 */
export async function createCheckoutSession(options: CheckoutOptions): Promise<string | null> {
  const {
    lineItems = [],
    customLineItems = [],
    successUrl,
    cancelUrl,
    metadata = {},
    customerEmail,
    clientReferenceId,
    promotionCode,
    allowPromotionCodes = true,
    shippingAddressCollection = false,
    taxIdCollection = false,
  } = options

  try {
    // Validate inputs
    if (lineItems.length === 0 && customLineItems.length === 0) {
      throw new Error("No items provided for checkout")
    }

    if (!successUrl || !cancelUrl) {
      throw new Error("Success and cancel URLs are required")
    }

    // Create session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      metadata,
      line_items: [],
      allow_promotion_codes: allowPromotionCodes,
    }

    // Add client reference ID if provided
    if (clientReferenceId) {
      sessionParams.client_reference_id = clientReferenceId
    }

    // Add customer email if provided
    if (customerEmail) {
      sessionParams.customer_email = customerEmail
    }

    // Add promotion code if provided
    if (promotionCode) {
      sessionParams.discounts = [
        {
          promotion_code: promotionCode,
        },
      ]
    }

    // Add shipping address collection if requested
    if (shippingAddressCollection) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ["US", "CA", "GB", "AU"],
      }
    }

    // Add tax ID collection if requested
    if (taxIdCollection) {
      sessionParams.tax_id_collection = {
        enabled: true,
      }
    }

    // Add regular line items if they exist
    if (lineItems.length > 0) {
      sessionParams.line_items = lineItems
    }

    // Add custom line items if they exist
    if (customLineItems.length > 0) {
      sessionParams.line_items = sessionParams.line_items || []

      customLineItems.forEach((item) => {
        sessionParams.line_items!.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              description: item.description,
              images: item.images,
            },
            unit_amount: Math.round(item.amount * 100), // Convert to cents
          },
          quantity: item.quantity,
          tax_rates: item.tax_rates,
        })
      })
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    // Return the URL to redirect to
    return session.url
  } catch (error) {
    console.error("Stripe checkout error:", error)
    throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Handles Stripe webhook events
 *
 * @param request - The incoming webhook request
 * @returns Result of webhook processing
 */
export async function handleStripeWebhook(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return { error: "Missing stripe-signature header" }
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return { error: "Webhook signature verification failed" }
  }

  try {
    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Process the successful payment
        await processSuccessfulPayment(session)

        // Revalidate the success page to show the latest data
        revalidatePath("/success")
        break
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`Payment succeeded for intent: ${paymentIntent.id}`)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error(`Payment failed for intent: ${paymentIntent.id}`, paymentIntent.last_payment_error)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { received: true, type: event.type }
  } catch (error) {
    console.error(`Error processing webhook event ${event.type}:`, error)
    return { error: `Error processing webhook: ${error instanceof Error ? error.message : String(error)}` }
  }
}

/**
 * Process a successful payment from a completed checkout session
 *
 * @param session - The completed Stripe checkout session
 */
async function processSuccessfulPayment(session: Stripe.Checkout.Session) {
  // Get customer information
  let customerDetails = null

  if (session.customer) {
    try {
      customerDetails = await stripe.customers.retrieve(session.customer as string)
    } catch (error) {
      console.error("Error retrieving customer details:", error)
    }
  }

  // Get line items from the session
  let lineItems = null

  try {
    const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id)
    lineItems = lineItemsResponse.data
  } catch (error) {
    console.error("Error retrieving line items:", error)
  }

  // Here you would typically:
  // 1. Update your database with order information
  // 2. Send confirmation emails
  // 3. Update inventory
  // 4. Create user accounts if needed

  console.log("Payment successful for session:", {
    sessionId: session.id,
    customerId: session.customer,
    customerEmail: session.customer_email,
    amountTotal: session.amount_total,
    currency: session.currency,
    paymentStatus: session.payment_status,
    metadata: session.metadata,
    lineItems,
    customerDetails,
  })

  // Example: Send confirmation email
  // await sendConfirmationEmail(session.customer_email, session.id, lineItems)
}

/**
 * Creates a customer portal session for managing subscriptions
 *
 * @param customerId - The Stripe customer ID
 * @param returnUrl - URL to return to after the portal session
 * @returns URL to the customer portal
 */
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return portalSession.url
  } catch (error) {
    console.error("Error creating customer portal session:", error)
    throw new Error("Failed to create customer portal session")
  }
}

/**
 * Retrieves payment information for a specific session
 *
 * @param sessionId - The Stripe checkout session ID
 * @returns Payment details
 */
export async function getPaymentDetails(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "line_items", "customer"],
    })

    return session
  } catch (error) {
    console.error("Error retrieving payment details:", error)
    throw new Error("Failed to retrieve payment details")
  }
}
