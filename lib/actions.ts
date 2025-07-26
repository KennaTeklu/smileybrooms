"use server"

import Stripe from "stripe"
import type { CheckoutData, CartItem } from "@/lib/types"
import { getContactInfo } from "@/lib/payment-config"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

// Function to send order data to Google Apps Script
async function sendOrderToGoogleSheet(orderData: any) {
  const appsScriptUrl = process.env.APPS_SCRIPT_WEB_APP_URL

  if (!appsScriptUrl) {
    console.error("APPS_SCRIPT_WEB_APP_URL is not set in environment variables.")
    return { success: false, error: "Apps Script URL not configured." }
  }

  try {
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    const result = await response.json()
    if (result.success) {
      console.log("Order data successfully sent to Google Sheet:", result.message)
      return { success: true, message: result.message }
    } else {
      console.error("Failed to send order data to Google Sheet:", result.error)
      return { success: false, error: result.error }
    }
  } catch (error: any) {
    console.error("Error sending order data to Google Sheet:", error)
    return { success: false, error: error.message || "Network error sending data to Google Sheet." }
  }
}

interface CustomerData {
  name: string
  email: string
  phone?: string
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

export interface CheckoutSessionData {
  customLineItems: Array<{
    name: string
    description?: string
    amount: number
    quantity: number
  }>
  discount?: {
    type: "percentage" | "fixed"
    value: number
    description: string
  }
  customerData: {
    name: string
    email: string
    phone: string
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  }
  metadata: {
    paymentMethod: string
    deviceType: string
    allowVideoRecording: boolean
    videoConsentDetails?: string
    orderType: string
  }
}

export async function createCheckoutSession(checkoutData: CheckoutData) {
  try {
    const { customLineItems, discount, customerData, metadata } = checkoutData

    // Calculate total amount in cents for Stripe
    const totalAmountCents = customLineItems.reduce((sum, item) => sum + item.amount * item.quantity, 0)
    const discountAmountCents = discount ? discount.value * 100 : 0
    const taxRate = 0.08 // 8% tax
    const taxableAmountCents = totalAmountCents - discountAmountCents
    const taxAmountCents = Math.round(taxableAmountCents * taxRate)
    const finalAmountCents = totalAmountCents - discountAmountCents + taxAmountCents

    // Prepare line items for Stripe
    const lineItems = customLineItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.amount * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Add tax as a separate line item if applicable
    if (taxAmountCents > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Sales Tax",
            description: "Applicable sales tax",
          },
          unit_amount: taxAmountCents,
        },
        quantity: 1,
      })
    }

    // Prepare discounts for Stripe
    const discounts = discount
      ? [
          {
            coupon: await stripe.coupons
              .create({
                amount_off: discountAmountCents,
                currency: "usd",
                name: discount.description,
                duration: "once",
              })
              .then((coupon) => coupon.id),
          },
        ]
      : []

    // Create Stripe Customer
    const customer = await stripe.customers.create({
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      address: {
        line1: customerData.address.line1,
        line2: customerData.address.line2,
        city: customerData.address.city,
        state: customerData.address.state,
        postal_code: customerData.address.postal_code,
        country: customerData.address.country,
      },
      metadata: {
        ...metadata,
        source: "website_checkout",
      },
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Default to card, will be overridden by payment_method_options for digital wallets
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/canceled`,
      customer: customer.id,
      discounts: discounts,
      metadata: {
        ...metadata,
        customer_id: customer.id,
        cart_value: totalAmountCents.toString(),
        final_total: finalAmountCents.toString(),
      },
      // Dynamic payment method options for Apple Pay / Google Pay
      payment_method_options: {
        card: {
          request_three_d_secure: "any",
        },
        ...(metadata.paymentMethod === "apple_pay" && {
          apple_pay: {
            request_billing_address: "required",
          },
        }),
        ...(metadata.paymentMethod === "google_pay" && {
          google_pay: {
            request_billing_address: "required",
          },
        }),
      },
    })

    // Log order data to Google Sheet after successful session creation
    const orderDataForSheet = {
      orderId: session.id, // Use Stripe session ID as order ID for online payments
      orderStatus: "Pending Payment", // Status before actual payment confirmation
      customer: {
        firstName: customerData.name.split(" ")[0] || "",
        lastName: customerData.name.split(" ").slice(1).join(" ") || "",
        email: customerData.email,
        phone: customerData.phone,
        notes: metadata.internalNotes || "",
      },
      address: customerData.address,
      serviceDetails: {
        type: metadata.orderType || "Cleaning Service",
        frequency: metadata.frequency || "One-time", // Assuming these are passed in metadata
        date: metadata.bookingDate || "",
        time: metadata.bookingTime || "",
        specialInstructions: metadata.specialInstructions || "",
      },
      cart: {
        rooms: customLineItems
          .filter((item) => item.description?.includes("room"))
          .map((item) => ({
            category: item.name,
            count: item.quantity,
            customizations: item.description?.split(", ").slice(1) || [], // Example: "Bathroom, Deep Clean"
          })),
        addons: customLineItems
          .filter((item) => !item.description?.includes("room"))
          .map((item) => ({
            name: item.name,
            quantity: item.quantity,
          })),
      },
      pricing: {
        subtotal: totalAmountCents / 100,
        discountAmount: discountAmountCents / 100,
        taxAmount: taxAmountCents / 100,
        totalAmount: finalAmountCents / 100,
      },
      payment: {
        method: metadata.paymentMethod,
        status: "pending",
        transactionId: session.id,
      },
      metadata: {
        deviceType: metadata.deviceType,
        browser: metadata.browser || "",
        ipAddress: metadata.ipAddress || "",
        userAgent: metadata.userAgent || "",
        allowVideoRecording: metadata.allowVideoRecording,
        videoConsentDetails: metadata.videoConsentDetails || "",
        utmSource: metadata.utmSource || "",
        utmMedium: metadata.utmMedium || "",
        utmCampaign: metadata.utmCampaign || "",
        referrerUrl: metadata.referrerUrl || "",
        sessionId: metadata.sessionId || "",
        cartId: metadata.cartId || "",
        couponCodeApplied: metadata.couponCodeApplied || "",
        customerSegment: metadata.customerSegment || "",
        internalNotes: metadata.internalNotes || "",
      },
    }

    await sendOrderToGoogleSheet(orderDataForSheet)

    return { success: true, checkout_url: session.url, session_id: session.id }
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return { success: false, error: error.message || "Failed to create checkout session." }
  }
}

// This function is for 'contact_for_alternatives' payment method
export async function processContactOrder(checkoutData: CheckoutData) {
  const contactInfo = getContactInfo()
  const { customerData, address, metadata, customLineItems } = checkoutData

  // Calculate pricing for logging
  const subtotal = customLineItems.reduce((sum, item) => sum + item.amount * item.quantity, 0)
  const discountAmount = metadata.discount ? metadata.discount.value : 0
  const tax = (subtotal - discountAmount) * 0.08
  const total = subtotal - discountAmount + tax

  const orderDataForSheet = {
    orderId: `ORD-${Date.now()}`, // Generate a unique ID for contact orders
    orderStatus: "Pending Contact", // Status for contact orders
    customer: {
      firstName: customerData.name.split(" ")[0] || "",
      lastName: customerData.name.split(" ").slice(1).join(" ") || "",
      email: customerData.email,
      phone: customerData.phone,
      notes: metadata.internalNotes || "",
    },
    address: address,
    serviceDetails: {
      type: metadata.orderType || "Cleaning Service",
      frequency: metadata.frequency || "One-time",
      date: metadata.bookingDate || "",
      time: metadata.bookingTime || "",
      specialInstructions: metadata.specialInstructions || "",
    },
    cart: {
      rooms: customLineItems
        .filter((item) => item.description?.includes("room"))
        .map((item) => ({
          category: item.name,
          count: item.quantity,
          customizations: item.description?.split(", ").slice(1) || [],
        })),
      addons: customLineItems
        .filter((item) => !item.description?.includes("room"))
        .map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
    },
    pricing: {
      subtotal: subtotal,
      discountAmount: discountAmount,
      taxAmount: tax,
      totalAmount: total,
    },
    payment: {
      method: "contact_for_alternatives",
      status: "pending_contact",
      transactionId: "", // No Stripe transaction ID for this method
    },
    metadata: {
      deviceType: metadata.deviceType,
      browser: metadata.browser || "",
      ipAddress: metadata.ipAddress || "",
      userAgent: metadata.userAgent || "",
      allowVideoRecording: metadata.allowVideoRecording,
      videoConsentDetails: metadata.videoConsentDetails || "",
      utmSource: metadata.utmSource || "",
      utmMedium: metadata.utmMedium || "",
      utmCampaign: metadata.utmCampaign || "",
      referrerUrl: metadata.referrerUrl || "",
      sessionId: metadata.sessionId || "",
      cartId: metadata.cartId || "",
      couponCodeApplied: metadata.couponCodeApplied || "",
      customerSegment: metadata.customerSegment || "",
      internalNotes: metadata.internalNotes || "",
    },
  }

  await sendOrderToGoogleSheet(orderDataForSheet)

  return {
    success: true,
    message: `Order submitted! We'll call you at ${customerData.phone} to arrange payment.`,
    contactPhone: contactInfo.phoneFormatted,
  }
}

export async function createPaymentIntent(data: {
  amount: number
  currency: string
  payment_method?: string
  customer_data: CustomerData
  cart_items: CartItem[]
  payment_method_type: string
}) {
  try {
    const { amount, currency, payment_method, customer_data, cart_items, payment_method_type } = data

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method,
      confirmation_method: "manual",
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/success`,
      metadata: {
        customer_name: customer_data.name,
        customer_email: customer_data.email,
        customer_phone: customer_data.phone || "",
        payment_method_type,
        cart_items_count: cart_items.length.toString(),
      },
    })

    return {
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment intent",
    }
  }
}

// Handle webhook events from Stripe
export async function handleStripeWebhook(event: any) {
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object
        console.log("Payment successful:", session.id)
        // Handle successful payment
        // You can update your database, send confirmation emails, etc.
        break

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        console.log("Payment intent succeeded:", paymentIntent.id)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        console.log("Payment failed:", failedPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Webhook error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Webhook processing failed" }
  }
}

export async function sendOrderConfirmationEmail(orderData: any) {
  try {
    // Simulate email sending
    console.log("Sending order confirmation email:", orderData)

    // In a real app, you'd use a service like SendGrid, Resend, etc.
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true }
  } catch (error) {
    console.error("Failed to send order confirmation email:", error)
    throw error
  }
}
