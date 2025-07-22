"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function createCheckoutSession(items: any[], customerData: any) {
  try {
    // Validate and sanitize cart items
    const lineItems = items.map((item) => {
      // Ensure unitPrice is a valid number
      const unitPrice =
        typeof item.unitPrice === "number" && !isNaN(item.unitPrice)
          ? Math.round(item.unitPrice * 100) // Convert to cents
          : 2500 // Default fallback price in cents ($25.00)

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || "Cleaning Service",
            description: item.meta?.description || "Professional cleaning service",
            images: item.image ? [item.image] : [],
          },
          unit_amount: unitPrice,
        },
        quantity: item.quantity || 1,
      }
    })

    // Calculate total for validation
    const total = lineItems.reduce((sum, item) => sum + item.price_data.unit_amount * item.quantity, 0)

    if (total <= 0) {
      throw new Error("Invalid cart total")
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/canceled`,
      customer_email: customerData?.contact?.email,
      customer_creation: "always",
      metadata: {
        customerName: `${customerData?.contact?.firstName || ""} ${customerData?.contact?.lastName || ""}`.trim(),
        customerPhone: customerData?.contact?.phone || "",
        serviceAddress:
          `${customerData?.address?.address || ""}, ${customerData?.address?.city || ""}, ${customerData?.address?.state || ""} ${customerData?.address?.zipCode || ""}`.trim(),
        specialInstructions: customerData?.address?.specialInstructions || "",
        allowVideoRecording: customerData?.payment?.allowVideoRecording ? "true" : "false",
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
