/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
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
        amount: -discountedAmount, // Negative amount for discount
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: isRecurring ? "subscription" : "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      customer_creation: customerEmail ? "always" : undefined,
      custom_fields: customerData
        ? [
            {
              key: "name",
              label: {
                type: "custom",
                custom: "Full Name",
              },
              type: "text",
            },
            {
              key: "phone",
              label: {
                type: "custom",
                custom: "Phone Number",
              },
              type: "text",
            },
            {
              key: "address",
              label: {
                type: "custom",
                custom: "Address",
              },
              type: "text",
            },
            {
              key: "city",
              label: {
                type: "custom",
                custom: "City",
              },
              type: "text",
            },
            {
              key: "state",
              label: {
                type: "custom",
                custom: "State",
              },
              type: "text",
            },
            {
              key: "postal_code",
              label: {
                type: "custom",
                custom: "Postal Code",
              },
              type: "text",
            },
            {
              key: "country",
              label: {
                type: "custom",
                custom: "Country",
              },
              type: "text",
            },
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
            country: customerData.address.country,
          }
        : undefined,
    })

    return JSON.stringify({ url: session.url })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return JSON.stringify({ error: error.message })
  }
}
