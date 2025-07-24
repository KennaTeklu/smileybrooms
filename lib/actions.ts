"use server"

import Stripe from "stripe"
import { redirect } from "next/navigation"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category?: string
  paymentType?: string
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

export async function createCheckoutSession(data: CheckoutSessionData) {
  try {
    // For contact_for_alternatives, redirect to a confirmation page instead of Stripe
    if (data.metadata.paymentMethod === 'contact_for_alternatives') {
      // Store the order data for the confirmation page
      const orderData = {
        ...data,
        orderId: `ORDER-${Date.now()}`,
        status: 'pending_contact',
        createdAt: new Date().toISOString(),
      }
      
      // In a real app, you'd save this to a database
      console.log('Order created for contact payment:', orderData)
      
      // Redirect to a special confirmation page for contact payments
      redirect('/order-confirmation?type=contact')
    }

    // For digital wallet payments, create Stripe checkout session
    const lineItems = data.customLineItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.amount * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Add discount if applicable
    const discounts = data.discount ? [{
      coupon: data.discount.type === 'percentage' 
        ? `${data.discount.value}PERCENT` 
        : `${data.discount.value}FIXED`
    }] : undefined

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/checkout`,
      customer_email: data.customerData.email,
      billing_address_collection: 'auto',
      shipping_address_collection: data.customerData.address ? {
        allowed_countries: ['US'],
      } : undefined,
      discounts,
      metadata: {
        device_type: data.metadata.deviceType,
        payment_method_type: data.metadata.paymentMethod,
        customer_name: data.customerData.name,
        customer_phone: data.customerData.phone,
        customer_address_line1: data.customerData.address.line1,
        customer_address_city: data.customerData.address.city,
        customer_address_state: data.customerData.address.state,
        customer_address_postal_code: data.customerData.address.postal_code,
        customer_address_country: data.customerData.address.country,
        wants_live_video: data.metadata.allowVideoRecording ? "true" : "false",
        video_consent_details: data.metadata.videoConsentDetails || "N/A",
        order_type: data.metadata.orderType,
      },
    })

    // Log successful session creation for debugging
    console.log(`Stripe session created: ${session.id} for device: ${data.metadata.deviceType}, payment: ${data.metadata.paymentMethod}`)

    return { 
      success: true, 
      checkout_url: session.url,
      session_id: session.id 
    }
  } catch (err: any) {
    console.error("Error creating checkout session:", err)
    throw new Error(`Failed to create checkout session: ${err?.message ?? "unknown error"}`)
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
      confirmation_method: 'manual',
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/success`,
      metadata: {
        customer_name: customer_data.name,
        customer_email: customer_data.email,
        customer_phone: customer_data.phone || '',
        payment_method_type,
        cart_items_count: cart_items.length.toString(),
      }
    })

    return {
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    }

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent'
    }
  }
}

// Handle webhook events from Stripe
export async function handleStripeWebhook(event: any) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Payment successful:', session.id)
        // Handle successful payment
        // You can update your database, send confirmation emails, etc.
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment intent succeeded:', paymentIntent.id)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('Payment failed:', failedPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Webhook error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Webhook processing failed' }
  }
}

export async function sendOrderConfirmationEmail(orderData: any) {
  try {
    // Simulate email sending
    console.log('Sending order confirmation email:', orderData)
    
    // In a real app, you'd use a service like SendGrid, Resend, etc.
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return { success: true }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    throw error
  }
}
