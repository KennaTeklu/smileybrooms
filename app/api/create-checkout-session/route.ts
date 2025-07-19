import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
// Ensure STRIPE_SECRET_KEY is set in your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20", // Use the latest API version
})

export async function POST(req: Request) {
  try {
    const { lineItems, customerInfo, metadata } = await req.json()

    // Validate incoming data (basic validation, enhance as needed)
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json({ message: "No line items provided" }, { status: 400 })
    }
    if (!customerInfo || !customerInfo.email || !customerInfo.name) {
      return NextResponse.json({ message: "Customer information is incomplete" }, { status: 400 })
    }

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL
    if (!appBaseUrl) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_APP_BASE_URL environment variable is not set." },
        { status: 500 },
      )
    }

    // Ensure the base URL has an explicit scheme (http:// or https://)
    const baseUrlWithScheme =
      appBaseUrl.startsWith("http://") || appBaseUrl.startsWith("https://") ? appBaseUrl : `https://${appBaseUrl}` // Default to https if no scheme is provided

    // Create a Stripe Customer (optional, but good for recurring customers)
    // You might want to check if a customer already exists by email
    let customerId: string | undefined
    try {
      const customers = await stripe.customers.list({
        email: customerInfo.email,
        limit: 1,
      })
      if (customers.data.length > 0) {
        customerId = customers.data[0].id
      } else {
        const newCustomer = await stripe.customers.create({
          email: customerInfo.email,
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          metadata: {
            ...metadata, // Pass any relevant metadata from your checkout process
            full_name: customerInfo.name,
            phone_number: customerInfo.phone,
            address_line1: customerInfo.address.line1,
            address_line2: customerInfo.address.line2,
            address_city: customerInfo.address.city,
            address_state: customerInfo.address.state,
            address_zip: customerInfo.address.postal_code,
          },
        })
        customerId = newCustomer.id
      }
    } catch (customerError) {
      console.error("Error creating/retrieving Stripe customer:", customerError)
      // Continue without customerId if there's an error, or return an error response
    }

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // You can add 'paypal', 'us_bank_account', etc.
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrlWithScheme}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrlWithScheme}/canceled`,
      customer: customerId, // Link the session to the customer
      customer_email: customerId ? undefined : customerInfo.email, // Only if customer is not set
      metadata: {
        ...metadata, // Pass all collected metadata from the frontend
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        // Ensure all metadata values are strings
        allowVideoRecording: String(metadata.allowVideoRecording),
        videoConsentDetails: String(metadata.videoConsentDetails),
        agreeToTerms: String(metadata.agreeToTerms),
      },
      shipping_address_collection: {
        allowed_countries: ["US"], // Specify allowed countries for shipping address
      },
      billing_address_collection: "required", // Collect billing address
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Stripe session creation failed:", error)
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 })
  }
}
