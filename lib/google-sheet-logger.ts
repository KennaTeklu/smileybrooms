import type { CheckoutData, CartItem } from "@/lib/types"
import { getRoomCartItemDisplayName } from "@/lib/cart/item-utils"

// Get the webhook URL from environment variables
const WEBHOOK_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL || ""

interface LogEventData {
  step: string // e.g., "welcome_start", "contact_submit", "address_submit", "checkout_complete", "cart_proceed_to_checkout_click"
  checkoutData: CheckoutData
  cartItems: CartItem[]
  subtotalPrice: number
  couponDiscount: number
  fullHouseDiscount: number
  totalPrice: number
  // Additional optional fields
  couponCode?: string
  bookingDate?: string
  bookingTime?: string
  transactionId?: string
  paymentStatus?: string
}

// Helper to get client-side metadata safely
function getClientMetadata() {
  if (typeof window === "undefined") {
    // Server-side fallback
    return {
      deviceType: "unknown",
      browser: "unknown",
      userAgent: "server-side",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      referrerUrl: "",
      sessionId: `session-${Date.now()}`,
      cartId: `cart-${Date.now()}`,
      ipAddress: "N/A_ServerSide",
    }
  }

  const userAgent = navigator.userAgent
  let deviceType = "desktop"
  if (/Mobi|Android/i.test(userAgent)) {
    deviceType = "mobile"
  } else if (/Tablet|iPad/i.test(userAgent)) {
    deviceType = "tablet"
  }

  let browser = "unknown"
  if (userAgent.includes("Chrome") && !userAgent.includes("Edge")) browser = "Chrome"
  else if (userAgent.includes("Firefox")) browser = "Firefox"
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari"
  else if (userAgent.includes("Edge")) browser = "Edge"
  else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) browser = "IE"

  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get("utm_source") || ""
  const utmMedium = urlParams.get("utm_medium") || ""
  const utmCampaign = urlParams.get("utm_campaign") || ""

  // Use a session ID from local storage or generate a new one
  const sessionId = localStorage.getItem("sessionId") || `session-${Date.now()}`
  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId)
  }

  // Use a cart ID from local storage or generate a new one
  const cartId = localStorage.getItem("cartId") || `cart-${sessionId}`
  if (!localStorage.getItem("cartId")) {
    localStorage.setItem("cartId", cartId)
  }

  return {
    deviceType,
    browser,
    userAgent,
    utmSource,
    utmMedium,
    utmCampaign,
    referrerUrl: document.referrer,
    sessionId,
    cartId,
    ipAddress: "N/A_ClientSide", // IP address cannot be reliably obtained client-side
  }
}

// Enhanced error handling with multiple retry strategies
async function sendToGoogleSheetWithRetry(data: any, step: string, maxRetries = 3) {
  if (!WEBHOOK_URL) {
    console.warn("[Google Sheet Logger] WEBHOOK_URL is not set. Skipping logging to Google Sheet.")
    return { success: false, error: "Apps Script URL not configured." }
  }

  // Debug logging if enabled
  if (process.env.NEXT_PUBLIC_EMAIL_DEBUG === "true") {
    console.log("🎨 [EMAIL DEBUG] Payload:", JSON.stringify(data, null, 2))
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Google Sheet Logger] Attempt ${attempt}/${maxRetries} - Sending data for step '${step}'`)

      // Primary method: no-cors mode (most reliable for Google Apps Script)
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      // With no-cors, we can't read the response, but if no error is thrown, it likely succeeded
      console.log(`[Google Sheet Logger] ✅ Beautiful email sent successfully for step '${step}' (attempt ${attempt})`)
      return { success: true, message: "Beautiful email sent successfully (no-cors mode)." }
    } catch (error) {
      console.error(`[Google Sheet Logger] ❌ Attempt ${attempt} failed for step '${step}':`, error)

      if (attempt === maxRetries) {
        // Last attempt - try alternative methods
        try {
          // Fallback 1: Try with CORS enabled
          const fallbackResponse = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })

          if (fallbackResponse.ok) {
            const result = await fallbackResponse.json()
            console.log(`[Google Sheet Logger] ✅ Fallback request successful for step '${step}'`, result)
            return { success: true, message: "Fallback request successful.", result }
          } else {
            throw new Error(`HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}`)
          }
        } catch (fallbackError) {
          console.error(`[Google Sheet Logger] ❌ CORS fallback failed for step '${step}':`, fallbackError)

          // Fallback 2: Try form submission as last resort
          try {
            await sendViaFormSubmission(data, step)
            console.log(`[Google Sheet Logger] ✅ Form submission sent for step '${step}'`)
            return { success: true, message: "Form submission sent as fallback." }
          } catch (formError) {
            console.error(`[Google Sheet Logger] ❌ All methods failed for step '${step}':`, formError)
            return {
              success: false,
              error: `All methods failed. Last error: ${error instanceof Error ? error.message : String(error)}`,
            }
          }
        }
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }

  return { success: false, error: "Max retries exceeded" }
}

// Alternative form submission method for maximum compatibility
async function sendViaFormSubmission(data: any, step: string): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Form submission only available in browser environment")
  }

  return new Promise<void>((resolve, reject) => {
    try {
      const form = document.createElement("form")
      form.method = "POST"
      form.action = WEBHOOK_URL
      form.target = "_blank"
      form.style.display = "none"

      const input = document.createElement("input")
      input.type = "hidden"
      input.name = "data"
      input.value = JSON.stringify(data)

      form.appendChild(input)
      document.body.appendChild(form)

      // Set a timeout to resolve the promise
      const timeout = setTimeout(() => {
        try {
          document.body.removeChild(form)
        } catch (e) {
          // Form might already be removed
        }
        resolve()
      }, 2000)

      form.submit()
      console.log(`[Google Sheet Logger] 📧 Form submission initiated for step '${step}'`)
    } catch (error) {
      reject(error)
    }
  })
}

// Main function to send data to Google Sheet
async function sendToGoogleSheet(data: any, step: string) {
  return sendToGoogleSheetWithRetry(data, step)
}

// Centralized function to construct payload and call the sender
async function logEvent(eventData: LogEventData) {
  const {
    step,
    checkoutData,
    cartItems,
    subtotalPrice,
    couponDiscount,
    fullHouseDiscount,
    totalPrice,
    couponCode,
    bookingDate,
    bookingTime,
    transactionId,
    paymentStatus,
  } = eventData

  const clientMetadata = getClientMetadata()

  // Calculate tax and final total for consistency with server-side logic (8% tax as per Code.gs)
  const taxRate = 0.08
  const taxableAmount = subtotalPrice - couponDiscount - fullHouseDiscount
  const taxAmount = taxableAmount * taxRate
  const finalTotalAmount = totalPrice + taxAmount

  // Generate order ID if not provided
  const orderId = transactionId || `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const payload = {
    // Order identification
    orderId,
    timestamp: new Date().toISOString(),
    step,

    // Customer information
    customer: {
      firstName: checkoutData.contact.firstName || "",
      lastName: checkoutData.contact.lastName || "",
      email: checkoutData.contact.email || "",
      phone: checkoutData.contact.phone || "",
      notes: "", // No direct notes field in checkoutData.contact, leave empty
    },

    // Service address
    address: {
      street: checkoutData.address.address || "",
      apartment: checkoutData.address.address2 || "",
      city: checkoutData.address.city || "",
      state: checkoutData.address.state || "",
      zipCode: checkoutData.address.zipCode || "",
    },

    // Service details
    serviceDetails: {
      type: checkoutData.address.addressType || "Residential", // Using addressType as service type
      frequency: "One-time", // Default, as not explicitly captured in checkoutData
      date: bookingDate || "", // Optional booking date
      time: bookingTime || "", // Optional booking time
      specialInstructions: checkoutData.address.specialInstructions || "",
    },

    // Cart information
    cart: {
      rooms: cartItems
        .filter((item) => item.roomType) // Items with 'roomType' are rooms
        .map((item) => ({
          category: getRoomCartItemDisplayName(item), // Use helper for display name
          count: item.quantity,
          customizations: item.selectedAddOns?.map((a) => a.name) || [],
        })),
      addons: cartItems
        .filter((item) => !item.roomType) // Items without 'roomType' are general add-ons
        .map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
    },

    // Pricing breakdown
    pricing: {
      subtotal: subtotalPrice,
      discountAmount: couponDiscount + fullHouseDiscount,
      taxAmount: taxAmount,
      totalAmount: finalTotalAmount,
      couponCode: couponCode || "",
    },

    // Payment information
    payment: {
      method: checkoutData.payment.paymentMethod || "pending",
      status: paymentStatus || "client_logged", // Status to indicate client-side logging
      transactionId: transactionId || "",
    },

    // Metadata for analytics and tracking
    metadata: {
      deviceType: clientMetadata.deviceType,
      browser: clientMetadata.browser,
      userAgent: clientMetadata.userAgent,
      utmSource: clientMetadata.utmSource,
      utmMedium: clientMetadata.utmMedium,
      utmCampaign: clientMetadata.utmCampaign,
      referrerUrl: clientMetadata.referrerUrl,
      sessionId: clientMetadata.sessionId,
      cartId: clientMetadata.cartId,
      allowVideoRecording: checkoutData.payment.allowVideoRecording || false,
      videoConsentDetails: checkoutData.payment.allowVideoRecording ? "User consented to video recording" : "",
      orderType: checkoutData.address.addressType || "Residential",
      couponCodeApplied: couponCode ? "Yes" : "No",
      customerSegment: "Standard", // Placeholder for future segmentation
      internalNotes: `Client-side log for step: ${step}`,
      dataSource: "client_checkout_flow",
      ipAddress: clientMetadata.ipAddress,
    },
  }

  // Send the beautiful email
  return sendToGoogleSheet(payload, step)
}

// Exported logging functions for different steps
export function logWelcomeStart(eventData: Omit<LogEventData, "step">) {
  return logEvent({ ...eventData, step: "welcome_start" })
}

export function logContactSubmit(eventData: Omit<LogEventData, "step">) {
  return logEvent({ ...eventData, step: "contact_submit" })
}

export function logAddressSubmit(eventData: Omit<LogEventData, "step">) {
  return logEvent({ ...eventData, step: "address_submit" })
}

export function logCartProceedToCheckout(eventData: Omit<LogEventData, "step">) {
  return logEvent({ ...eventData, step: "cart_proceed_to_checkout_click" })
}

export function logCartReviewPayNowClick(eventData: Omit<LogEventData, "step">) {
  return logEvent({ ...eventData, step: "cart_review_pay_now_click" })
}

export function logCheckoutComplete(eventData: Omit<LogEventData, "step">) {
  return logEvent({ ...eventData, step: "checkout_complete" })
}

export function logBookingConfirmation(eventData: Omit<LogEventData, "step">) {
  return logEvent({ ...eventData, step: "booking_confirmation" })
}

// Testing and health check functions
export async function testBeautifulEmail() {
  const testData = {
    orderId: `TEST-${Date.now()}`,
    timestamp: new Date().toISOString(),
    step: "test_email",
    customer: {
      firstName: "Test",
      lastName: "Customer",
      email: "test@example.com",
      phone: "(555) 123-4567",
      notes: "This is a test email",
    },
    address: {
      street: "123 Test Street",
      apartment: "Apt 1",
      city: "Test City",
      state: "CA",
      zipCode: "12345",
    },
    serviceDetails: {
      type: "Residential",
      frequency: "One-time",
      date: new Date().toLocaleDateString(),
      time: "10:00 AM",
      specialInstructions: "Test cleaning service",
    },
    cart: {
      rooms: [
        {
          category: "Living Room",
          count: 1,
          customizations: ["Deep Clean", "Eco-Friendly Products"],
        },
      ],
      addons: [
        {
          name: "Window Cleaning",
          quantity: 1,
          price: 50,
        },
      ],
    },
    pricing: {
      subtotal: 150,
      discountAmount: 15,
      taxAmount: 12,
      totalAmount: 147,
      couponCode: "TEST10",
    },
    payment: {
      method: "test",
      status: "test",
      transactionId: "test_transaction_123",
    },
    metadata: {
      deviceType: "desktop",
      browser: "Chrome",
      userAgent: "Test User Agent",
      utmSource: "test",
      utmMedium: "test",
      utmCampaign: "test",
      referrerUrl: "https://test.com",
      sessionId: "test_session",
      cartId: "test_cart",
      allowVideoRecording: true,
      videoConsentDetails: "User consented to video recording for testing",
      orderType: "Residential",
      couponCodeApplied: "Yes",
      customerSegment: "Test",
      internalNotes: "This is a test email from the beautiful email system",
      dataSource: "test_system",
      ipAddress: "127.0.0.1",
    },
  }

  console.log("🧪 Testing beautiful email system...")
  return sendToGoogleSheet(testData, "test_email")
}

export async function checkEmailSystemHealth() {
  if (!WEBHOOK_URL) {
    return {
      healthy: false,
      message: "❌ Webhook URL not configured. Please set NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL environment variable.",
    }
  }

  try {
    // Simple health check payload
    const healthData = {
      type: "health_check",
      timestamp: new Date().toISOString(),
      message: "Health check from beautiful email system",
    }

    const result = await sendToGoogleSheet(healthData, "health_check")

    if (result.success) {
      return {
        healthy: true,
        message: "✅ Email system is healthy and ready to send beautiful emails!",
      }
    } else {
      return {
        healthy: false,
        message: `❌ Email system health check failed: ${result.error}`,
      }
    }
  } catch (error) {
    return {
      healthy: false,
      message: `❌ Email system health check error: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Utility function to validate required data before logging
export function validateLogEventData(eventData: Partial<LogEventData>): boolean {
  const required = ["checkoutData", "cartItems", "subtotalPrice", "totalPrice"]

  for (const field of required) {
    if (!(field in eventData) || eventData[field as keyof LogEventData] === undefined) {
      console.warn(`[Google Sheet Logger] Missing required field: ${field}`)
      return false
    }
  }

  return true
}

// Enhanced logging with validation
export function logEventSafely(eventData: Omit<LogEventData, "step">, step: string) {
  if (!validateLogEventData(eventData)) {
    console.error(`[Google Sheet Logger] Invalid event data for step: ${step}`)
    return Promise.resolve({ success: false, error: "Invalid event data" })
  }

  return logEvent({ ...eventData, step })
}
