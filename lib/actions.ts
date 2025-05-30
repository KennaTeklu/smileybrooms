"use server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

interface CheckoutSessionParams {
  lineItems: Array<{
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
  isRecurring: boolean
  discount?: {
    amount: number
    reason: string
  }
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
    } = params

    const customLineItems: any[] = initialCustomLineItems || []

    // Apply discount if provided
    let discountedAmount = 0
    if (params.discount && params.discount.amount > 0) {
      discountedAmount = params.discount.amount

      // Add discount as a negative line item
      customLineItems.push({
        name: `Discount: ${params.discount.reason}`,
        amount: -Math.round(discountedAmount * 100), // Convert to cents and make negative
        quantity: 1,
        currency: "usd", // Specify currency for custom line items
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems.length > 0 ? lineItems : undefined, // Only include if not empty
      mode: isRecurring ? "subscription" : "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      customer_creation: customerEmail ? "always" : undefined,
      // Use Stripe's built-in address collection
      billing_address_collection: "auto",
      shipping_address_collection: customerData?.address ? "required" : "off", // Collect shipping if customer data has address
      shipping_options: customerData?.address
        ? [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: {
                  amount: 0, // Free shipping for now, adjust as needed
                  currency: "usd",
                },
                display_name: "Standard shipping",
                delivery_estimate: {
                  minimum: { unit: "business_day", value: 5 },
                  maximum: { unit: "business_day", value: 7 },
                },
              },
            },
          ]
        : undefined,
      // Enable automatic tax calculation
      automatic_tax: {
        enabled: true,
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Add custom line items if any
      ...(customLineItems.length > 0 && {
        line_items: [
          ...(lineItems.length > 0 ? lineItems : []),
          ...customLineItems.map((item) => ({
            price_data: {
              currency: item.currency || "usd",
              product_data: {
                name: item.name,
                metadata: item.metadata,
              },
              unit_amount: item.amount,
            },
            quantity: item.quantity,
          })),
        ],
      }),
      // Pre-fill customer information if available
      customer_update: customerData
        ? {
            address: "auto", // Allow Stripe to pre-fill address if customer exists
            name: "auto",
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
          }
        : undefined,
    })

    return JSON.stringify({ url: session.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return JSON.stringify({ error: error.message })
  }
}
