"use server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

interface CheckoutSessionParams {
  lineItems: Array<{
    price?: string // price ID for existing products
    quantity: number
    // For subscription items, price is required. For one-time payments, price_data can be used.
    // To support metered/usage-based billing, these would be handled via subscription items with usage reporting.
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
  isRecurring: boolean
  discount?: {
    amount: number
    reason: string
  }
  // New parameters for comprehensive integration
  billingAddressCollection?: "auto" | "required"
  shippingAddressCollection?: {
    allowed_countries: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[]
  }
  automaticTax?: {
    enabled: boolean
  }
  promotionCode?: string // For applying promotion codes
  couponId?: string // For applying coupons
  trialPeriodDays?: number // For subscription trials
  cancelAtPeriodEnd?: boolean // For subscriptions
  subscriptionData?: {
    trial_period_days?: number
    cancel_at_period_end?: boolean
    billing_cycle_anchor?: number
    proration_behavior?: "always_invoice" | "create_prorations" | "keep_period_end" | "none"
    items?: Stripe.Checkout.SessionCreateParams.SubscriptionData.Item[]
    default_payment_method?: string
    metadata?: {
      [key: string]: string
    }
  }
  // For invoice customization, subscription schedules, upgrades/downgrades, metered/usage-based billing,
  // billing thresholds, and invoice item adjustments, these typically involve more complex logic
  // and direct Stripe API calls (e.g., stripe.subscriptions.create, stripe.subscriptionSchedules.create,
  // stripe.invoices.create, stripe.invoiceItems.create) rather than simple Checkout Session parameters.
  // The Checkout Session can initiate a subscription, and subsequent management would use other Stripe APIs.
}

export async function createCheckoutSession(params: CheckoutSessionParams) {
  try {
    const {
      lineItems,
      successUrl,
      cancelUrl,
      customerEmail,
      customerData,
      isRecurring,
      customLineItems: initialCustomLineItems,
      billingAddressCollection = "auto", // Default to auto
      shippingAddressCollection,
      automaticTax = { enabled: true }, // Default to enabled
      promotionCode,
      couponId,
      trialPeriodDays,
      cancelAtPeriodEnd,
      subscriptionData,
    } = params

    const customLineItems: any[] = initialCustomLineItems || []

    // Apply discount if provided
    let discountedAmount = 0
    if (params.discount && params.discount.amount > 0) {
      discountedAmount = params.discount.amount

      // Add discount as a negative line item
      customLineItems.push({
        name: `Discount: ${params.discount.reason}`,
        amount: -discountedAmount, // Negative amount for discount
        quantity: 1,
      })
    }

    // Combine line items and custom line items for the session
    const allLineItems = [
      ...lineItems,
      ...customLineItems.map((item) => ({
        price_data: {
          currency: "usd", // Assuming USD, adjust as needed
          product_data: {
            name: item.name,
            metadata: item.metadata,
          },
          unit_amount: Math.round(item.amount * 100), // Amount in cents
          recurring: isRecurring ? { interval: "month" } : undefined, // Example for recurring custom items
        },
        quantity: item.quantity,
      })),
    ]

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: allLineItems,
      mode: isRecurring ? "subscription" : "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      customer_creation: customerEmail ? "always" : undefined,
      billing_address_collection: billingAddressCollection,
      shipping_address_collection: shippingAddressCollection,
      automatic_tax: automaticTax,
      allow_promotion_codes: promotionCode || couponId ? true : false, // Enable if either is provided
      discounts: couponId ? [{ coupon: couponId }] : undefined, // Apply coupon if provided
      subscription_data: isRecurring
        ? {
            trial_period_days: trialPeriodDays,
            cancel_at_period_end: cancelAtPeriodEnd,
            ...subscriptionData, // Merge any additional subscription data
          }
        : undefined,
      // Custom fields for customer data (already present)
      custom_fields: customerData
        ? [
            { key: "name", label: { type: "custom", custom: "Full Name" }, type: "text" },
            { key: "phone", label: { type: "custom", custom: "Phone Number" }, type: "text" },
            { key: "address", label: { type: "custom", custom: "Address" }, type: "text" },
            { key: "city", label: { type: "custom", custom: "City" }, type: "text" },
            { key: "state", label: { type: "custom", custom: "State" }, type: "text" },
            { key: "postal_code", label: { type: "custom", custom: "Postal Code" }, type: "text" },
            { key: "country", label: { type: "custom", custom: "Country" }, type: "text" },
          ]
        : undefined,
      customer_update: customerData
        ? {
            address: "auto",
          }
        : undefined,
      metadata: customerData
        ? {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            address: customerData.address.line1,
            city: customerData.address.city,
            state: customerData.address.state,
            postal_code: customerData.address.postal_code,
            country: customerData.country,
            ...(promotionCode && { promotion_code: promotionCode }), // Add promotion code to metadata
          }
        : undefined,
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return JSON.stringify({ url: session.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return JSON.stringify({ error: error.message })
  }
}
