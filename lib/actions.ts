"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface CheckoutSessionParams {
  lineItems?: Array<{
    price: string
    quantity: number
  }>
  customLineItems?: Array<{
    name: string
    amount: number
    quantity: number
    description?: string
    images?: string[]
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
    allowVideoRecording?: boolean
    videoConsentDetails?: string
  }
  isRecurring?: boolean
  recurringInterval?: "day" | "week" | "month" | "year"
  discount?: {
    amount: number
    reason: string
  }
  shippingAddressCollection?: { allowed_countries: string[] }
  automaticTax?: { enabled: boolean }
  paymentMethodTypes?: Stripe.Checkout.SessionCreateParams.PaymentMethodType[]
  trialPeriodDays?: number
  cancelAtPeriodEnd?: boolean
  allowPromotions?: boolean
}

/* -------------------------------------------------------------------------- */
/* Server Action                                                              */
/* -------------------------------------------------------------------------- */

export async function createCheckoutSession(params: CheckoutSessionParams) {
  try {
    const {
      lineItems,
      successUrl,
      cancelUrl,
      customerEmail,
      customerData,
      isRecurring,
      recurringInterval,
      customLineItems: initialCustomLineItems,
      discount,
      shippingAddressCollection,
      automaticTax,
      paymentMethodTypes,
      trialPeriodDays,
      cancelAtPeriodEnd,
      allowPromotions,
    } = params

    /* -------- Generate dynamic Line-Items ---------------------------------- */
    const customLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = (initialCustomLineItems || []).map(
      (item) => {
        const unitAmount = Math.round((Number(item.amount) || 0) * 100)
        if (Number.isNaN(unitAmount)) throw new Error(`Invalid amount for item "${item.name}": ${item.amount}`)

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              description: item.description,
              images: item.images,
              metadata: item.metadata,
            },
            unit_amount: unitAmount,
            recurring: isRecurring && recurringInterval ? { interval: recurringInterval } : undefined,
          },
          quantity: item.quantity,
        }
      },
    )

    /* -------- Optional Discount ------------------------------------------- */
    if (discount && discount.amount > 0) {
      const discountAmount = Math.round((Number(discount.amount) || 0) * 100)
      if (Number.isNaN(discountAmount)) throw new Error(`Invalid discount amount: ${discount.amount}`)

      customLineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Discount – ${discount.reason}` },
          unit_amount: -discountAmount,
        },
        quantity: 1,
      })
    }

    /* -------- Assemble Checkout-Session params ---------------------------- */
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: paymentMethodTypes || ["card"],
      mode: isRecurring ? "subscription" : "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      customer_creation: customerEmail ? "always" : undefined,
      shipping_address_collection: shippingAddressCollection,
      automatic_tax: automaticTax,
      allow_promotion_codes: allowPromotions,
      line_items: lineItems && lineItems.length ? lineItems : customLineItems,
      subscription_data: isRecurring
        ? {
            trial_period_days: trialPeriodDays,
            cancel_at_period_end: cancelAtPeriodEnd,
          }
        : undefined,
      // ⚠️ DO NOT include `customer_update` unless you pass an explicit `customer`
      metadata: customerData
        ? {
            customer_name: customerData.name,
            customer_email: customerData.email,
            customer_phone: customerData.phone,
            customer_address_line1: customerData.address?.line1,
            customer_address_city: customerData.address?.city,
            customer_address_state: customerData.address?.state,
            customer_address_postal_code: customerData.address?.postal_code,
            customer_address_country: customerData.address?.country,
            wants_live_video: customerData.allowVideoRecording ? "true" : "false",
            video_consent_details: customerData.videoConsentDetails || "N/A",
          }
        : undefined,
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    return session.url
  } catch (err: any) {
    console.error("Error creating checkout session:", err)
    throw new Error(`Failed to create checkout session: ${err?.message ?? "unknown error"}`)
  }
}
