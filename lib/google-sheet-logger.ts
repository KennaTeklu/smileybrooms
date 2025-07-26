import type { CheckoutData, CartItem } from "@/lib/types"
import { getRoomCartItemDisplayName } from "@/lib/cart/item-utils"

// Replace YOUR_WEBHOOK_URL with the actual URL from Google Apps Script
const WEBHOOK_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL || ""

interface LogEventData {
  step: string // e.g., "welcome_start", "contact_submit", "address_submit", "checkout_complete", "cart_proceed_to_checkout_click"
  checkoutData: CheckoutData
  cartItems: CartItem[]
  subtotalPrice: number
  couponDiscount: number
  fullHouseDiscount: number
  totalPrice: number
  // Add any other relevant data from the client-side context
}

// Helper to get client-side metadata
function getClientMetadata() {
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
    // IP address cannot be reliably obtained client-side without a server endpoint
    ipAddress: "N/A_ClientSide",
  }
}

// Main function to send data to Google Sheet using fetch
async function sendToGoogleSheet(data: any, step: string) {
  if (!WEBHOOK_URL) {
    console.warn("[Google Sheet Logger] WEBHOOK_URL is not set. Skipping logging to Google Sheet.")
    return { success: false, error: "Apps Script URL not configured." }
  }

  try {
    console.log(`[Google Sheet Logger] Sending data for step '${step}':`, data)

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors", // This is crucial for Google Apps Script
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    // Note: With mode: 'no-cors', you can't read the response
    // But the data will still be sent successfully
    console.log(`[Google Sheet Logger] Data sent successfully for step '${step}'`)
    return { success: true, message: "Data sent successfully (no-cors mode)." }
  } catch (error) {
    console.error(`[Google Sheet Logger] Error sending data for step '${step}':`, error)

    // Fallback: Try without mode restriction
    try {
      const fallbackResponse = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const fallbackResult = await fallbackResponse.json() // Attempt to read response
      console.log(`[Google Sheet Logger] Fallback request successful for step '${step}'`, fallbackResult)
      return { success: true, message: "Fallback request successful.", result: fallbackResult }
    } catch (fallbackError) {
      console.error(`[Google Sheet Logger] Fallback also failed for step '${step}':`, fallbackError)
      return {
        success: false,
        error: `Network or Fetch Error: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }
}

// Alternative approach if the above doesn't work (bypasses CORS completely)
async function sendToGoogleSheetAlternative(data: any, step: string) {
  if (!WEBHOOK_URL) {
    console.warn("[Google Sheet Logger] WEBHOOK_URL is not set. Skipping logging to Google Sheet.")
    return { success: false, error: "Apps Script URL not configured." }
  }

  try {
    // Create a form and submit it (this bypasses CORS completely)
    const form = document.createElement("form")
    form.method = "POST"
    form.action = WEBHOOK_URL
    form.target = "_blank" // Optional: opens in new tab
    form.style.display = "none"

    const input = document.createElement("input")
    input.type = "hidden"
    input.name = "data" // Google Apps Script expects 'data' as the parameter name for JSON payload
    input.value = JSON.stringify(data)

    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)

    console.log(`[Google Sheet Logger] Form submission sent for step '${step}'`)
    return { success: true, message: "Form submission sent." }
  } catch (error) {
    console.error(`[Google Sheet Logger] Form submission failed for step '${step}':`, error)
    return { success: false, error: `Form submission error: ${error instanceof Error ? error.message : String(error)}` }
  }
}

// Centralized function to construct payload and call the sender
async function logEvent(eventData: LogEventData) {
  const { step, checkoutData, cartItems, subtotalPrice, couponDiscount, fullHouseDiscount, totalPrice } = eventData
  const clientMetadata = getClientMetadata()

  // Calculate tax and final total for consistency with server-side logic (8% tax as per Code.gs)
  const taxRate = 0.08
  const taxableAmount = subtotalPrice - couponDiscount - fullHouseDiscount
  const taxAmount = taxableAmount * taxRate
  const finalTotalAmount = totalPrice + taxAmount

  const payload = {
    customer: {
      firstName: checkoutData.contact.firstName,
      lastName: checkoutData.contact.lastName,
      email: checkoutData.contact.email,
      phone: checkoutData.contact.phone,
      notes: "", // No direct notes field in checkoutData.contact, leave empty
    },
    address: {
      street: checkoutData.address.address,
      apartment: checkoutData.address.address2,
      city: checkoutData.address.city,
      state: checkoutData.address.state,
      zipCode: checkoutData.address.zipCode,
    },
    serviceDetails: {
      type: checkoutData.address.addressType, // Using addressType as service type for now
      frequency: "One-time", // Default, as not explicitly captured in checkoutData
      date: "", // Default
      time: "", // Default
      specialInstructions: checkoutData.address.specialInstructions,
    },
    cart: {
      rooms: cartItems
        .filter((item) => item.roomType) // Assuming items with 'roomType' are rooms
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
    pricing: {
      subtotal: subtotalPrice,
      discountAmount: couponDiscount + fullHouseDiscount,
      taxAmount: taxAmount,
      totalAmount: finalTotalAmount,
    },
    payment: {
      method: checkoutData.payment.paymentMethod,
      status: "client_logged", // Status to indicate client-side logging
      transactionId: "", // No Stripe transaction ID at this stage
    },
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
      allowVideoRecording: checkoutData.payment.allowVideoRecording,
      videoConsentDetails: checkoutData.payment.allowVideoRecording ? "User consented to video recording" : "",
      orderType: checkoutData.address.addressType, // Re-using for consistency with Code.gs
      couponCodeApplied: cartItems.some((item) => item.couponApplied) ? "Yes" : "No", // Placeholder, refine if actual coupon codes are tracked
      customerSegment: "Standard", // Placeholder
      internalNotes: `Client-side log for step: ${step}`,
      dataSource: "client_checkout_flow",
      ipAddress: clientMetadata.ipAddress, // Will be "N/A_ClientSide"
    },
  }

  // Use the primary fetch method. If it fails, the internal fallback will try.
  // If you prefer the form submission method as primary, you can swap these.
  return sendToGoogleSheet(payload, step)
  // return sendToGoogleSheetAlternative(payload, step); // Uncomment this line to use the alternative method
}

// Example usage for your steps:
export function logCartProceedToCheckout(eventData: Omit<LogEventData, "step">) {
  logEvent({ ...eventData, step: "cart_proceed_to_checkout_click" })
}

export function logWelcomeStart(eventData: Omit<LogEventData, "step">) {
  logEvent({ ...eventData, step: "welcome_start" })
}

export function logContactSubmit(eventData: Omit<LogEventData, "step">) {
  logEvent({ ...eventData, step: "contact_submit" })
}

export function logAddressSubmit(eventData: Omit<LogEventData, "step">) {
  logEvent({ ...eventData, step: "address_submit" })
}

export function logCheckoutComplete(eventData: Omit<LogEventData, "step">) {
  logEvent({ ...eventData, step: "checkout_complete" })
}

export function logCartReviewPayNowClick(eventData: Omit<LogEventData, "step">) {
  logEvent({ ...eventData, step: "cart_review_pay_now_click" })
}
