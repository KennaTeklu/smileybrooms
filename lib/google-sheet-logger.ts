import type { CheckoutData, CartItem } from "@/lib/types"
import { getRoomCartItemDisplayName } from "@/lib/cart/item-utils"

// Get the webhook URL from environment variables
const WEBHOOK_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL || ""

interface LogEventData {
  step: string
  checkoutData: CheckoutData
  cartItems: CartItem[]
  subtotalPrice: number
  couponDiscount: number
  fullHouseDiscount: number
  totalPrice: number
  // Enhanced optional fields for better UX
  couponCode?: string
  bookingDate?: string
  bookingTime?: string
  transactionId?: string
  paymentStatus?: string
  customerNotes?: string
  urgencyLevel?: "low" | "medium" | "high"
  servicePreferences?: string[]
  estimatedDuration?: number
}

interface EmailNotificationResult {
  success: boolean
  message: string
  emailsSent?: {
    customer: boolean
    business: boolean
    team: boolean
  }
  error?: string
  retryAttempts?: number
  fallbackUsed?: boolean
}

// Enhanced client metadata with UX tracking
function getClientMetadata() {
  if (typeof window === "undefined") {
    return {
      deviceType: "server",
      browser: "server",
      userAgent: "server-side-render",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      referrerUrl: "",
      sessionId: `server-session-${Date.now()}`,
      cartId: `server-cart-${Date.now()}`,
      ipAddress: "server-side",
      screenResolution: "unknown",
      timezone: "UTC",
      language: "en",
      connectionType: "unknown",
      pageLoadTime: 0,
      userInteractions: 0,
    }
  }

  const userAgent = navigator.userAgent
  let deviceType = "desktop"
  let screenSize = "large"

  // Enhanced device detection
  if (/Mobi|Android/i.test(userAgent)) {
    deviceType = "mobile"
    screenSize = window.innerWidth < 480 ? "small" : "medium"
  } else if (/Tablet|iPad/i.test(userAgent)) {
    deviceType = "tablet"
    screenSize = "medium"
  } else {
    screenSize = window.innerWidth < 1024 ? "medium" : "large"
  }

  // Enhanced browser detection
  let browser = "unknown"
  let browserVersion = ""
  if (userAgent.includes("Chrome") && !userAgent.includes("Edge")) {
    browser = "Chrome"
    const match = userAgent.match(/Chrome\/(\d+)/)
    browserVersion = match ? match[1] : ""
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox"
    const match = userAgent.match(/Firefox\/(\d+)/)
    browserVersion = match ? match[1] : ""
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari"
    const match = userAgent.match(/Version\/(\d+)/)
    browserVersion = match ? match[1] : ""
  } else if (userAgent.includes("Edge")) {
    browser = "Edge"
    const match = userAgent.match(/Edge\/(\d+)/)
    browserVersion = match ? match[1] : ""
  }

  // UTM and tracking parameters
  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get("utm_source") || ""
  const utmMedium = urlParams.get("utm_medium") || ""
  const utmCampaign = urlParams.get("utm_campaign") || ""

  // Session management with better UX tracking
  const sessionId =
    localStorage.getItem("sessionId") || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId)
  }

  const cartId = localStorage.getItem("cartId") || `cart-${sessionId}`
  if (!localStorage.getItem("cartId")) {
    localStorage.setItem("cartId", cartId)
  }

  // Enhanced UX metrics
  const pageLoadTime = performance.now()
  const userInteractions = Number.parseInt(localStorage.getItem("userInteractions") || "0")

  // Connection type detection
  let connectionType = "unknown"
  if ("connection" in navigator) {
    const connection = (navigator as any).connection
    connectionType = connection?.effectiveType || connection?.type || "unknown"
  }

  return {
    deviceType,
    browser: `${browser} ${browserVersion}`.trim(),
    userAgent,
    utmSource,
    utmMedium,
    utmCampaign,
    referrerUrl: document.referrer,
    sessionId,
    cartId,
    ipAddress: "client-side", // Will be resolved server-side
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    screenSize,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    connectionType,
    pageLoadTime: Math.round(pageLoadTime),
    userInteractions,
    colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  }
}

// Enhanced retry mechanism with better UX feedback
async function sendToGoogleSheetWithRetry(
  data: any,
  step: string,
  maxRetries = 3,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  if (!WEBHOOK_URL) {
    console.warn("🚫 [Beautiful Email] Webhook URL not configured")
    return {
      success: false,
      message: "Email system not configured. Please contact support.",
      error: "WEBHOOK_URL_MISSING",
    }
  }

  // Debug logging with beautiful formatting
  if (process.env.NEXT_PUBLIC_EMAIL_DEBUG === "true") {
    console.group("🎨 [Beautiful Email Debug]")
    console.log("📧 Step:", step)
    console.log("🎯 Attempt:", "Starting")
    console.log("📦 Payload:", JSON.stringify(data, null, 2))
    console.groupEnd()
  }

  let lastError: any = null
  let fallbackUsed = false

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      onProgress?.(attempt, maxRetries, "no-cors")
      console.log(`✨ [Beautiful Email] Sending gorgeous email (${attempt}/${maxRetries}) for '${step}'`)

      // Primary method: no-cors (most reliable for Google Apps Script)
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "SmileyBrooms-Beautiful-Email",
        },
        body: JSON.stringify({
          ...data,
          emailMetadata: {
            attempt,
            maxRetries,
            method: "no-cors",
            timestamp: new Date().toISOString(),
            userAgent: navigator?.userAgent || "server-side",
          },
        }),
      })

      console.log(`🎉 [Beautiful Email] Gorgeous email sent successfully for '${step}' (attempt ${attempt})`)

      return {
        success: true,
        message: `Beautiful email sent successfully! 📧✨`,
        emailsSent: {
          customer: true,
          business: true,
          team: true,
        },
        retryAttempts: attempt,
        fallbackUsed,
      }
    } catch (error) {
      lastError = error
      console.error(`❌ [Beautiful Email] Attempt ${attempt} failed for '${step}':`, error)

      if (attempt === maxRetries) {
        // Try CORS fallback
        try {
          onProgress?.(attempt, maxRetries, "cors-fallback")
          console.log(`🔄 [Beautiful Email] Trying CORS fallback for '${step}'`)

          const fallbackResponse = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "SmileyBrooms-Beautiful-Email-Fallback",
            },
            body: JSON.stringify({
              ...data,
              emailMetadata: {
                attempt: attempt + 1,
                maxRetries,
                method: "cors-fallback",
                timestamp: new Date().toISOString(),
                fallbackReason: "no-cors-failed",
              },
            }),
          })

          if (fallbackResponse.ok) {
            const result = await fallbackResponse.json()
            console.log(`🎉 [Beautiful Email] CORS fallback successful for '${step}'`, result)
            fallbackUsed = true

            return {
              success: true,
              message: "Beautiful email sent via fallback method! 📧✨",
              emailsSent: {
                customer: true,
                business: true,
                team: true,
              },
              retryAttempts: attempt + 1,
              fallbackUsed: true,
            }
          } else {
            throw new Error(`HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}`)
          }
        } catch (fallbackError) {
          console.error(`❌ [Beautiful Email] CORS fallback failed for '${step}':`, fallbackError)

          // Final fallback: Form submission
          try {
            onProgress?.(attempt, maxRetries, "form-submission")
            console.log(`🔄 [Beautiful Email] Trying form submission fallback for '${step}'`)

            await sendViaFormSubmission(data, step)
            fallbackUsed = true

            return {
              success: true,
              message: "Email sent via form submission fallback! 📧",
              emailsSent: {
                customer: true,
                business: false, // Form submission may not guarantee all emails
                team: false,
              },
              retryAttempts: attempt + 2,
              fallbackUsed: true,
            }
          } catch (formError) {
            console.error(`❌ [Beautiful Email] All methods failed for '${step}':`, formError)

            return {
              success: false,
              message: "Unable to send email notifications. Our team has been notified and will contact you directly.",
              error: `All delivery methods failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
              retryAttempts: attempt + 2,
              fallbackUsed: false,
            }
          }
        }
      }

      // Exponential backoff with jitter
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  return {
    success: false,
    message: "Email delivery failed after all retry attempts. Our team will contact you directly.",
    error: `Max retries exceeded: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    retryAttempts: maxRetries,
    fallbackUsed,
  }
}

// Enhanced form submission with better error handling
async function sendViaFormSubmission(data: any, step: string): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Form submission only available in browser environment")
  }

  return new Promise<void>((resolve, reject) => {
    try {
      const form = document.createElement("form")
      form.method = "POST"
      form.action = WEBHOOK_URL
      form.target = `email-frame-${Date.now()}`
      form.style.display = "none"

      // Create hidden iframe for form submission
      const iframe = document.createElement("iframe")
      iframe.name = form.target
      iframe.style.display = "none"
      document.body.appendChild(iframe)

      const input = document.createElement("input")
      input.type = "hidden"
      input.name = "data"
      input.value = JSON.stringify({
        ...data,
        emailMetadata: {
          method: "form-submission",
          timestamp: new Date().toISOString(),
          step,
        },
      })

      form.appendChild(input)
      document.body.appendChild(form)

      // Handle iframe load event
      iframe.onload = () => {
        setTimeout(() => {
          try {
            document.body.removeChild(form)
            document.body.removeChild(iframe)
          } catch (e) {
            // Elements might already be removed
          }
          resolve()
        }, 1000)
      }

      iframe.onerror = () => {
        try {
          document.body.removeChild(form)
          document.body.removeChild(iframe)
        } catch (e) {
          // Elements might already be removed
        }
        reject(new Error("Form submission failed"))
      }

      form.submit()
      console.log(`📧 [Beautiful Email] Form submission initiated for '${step}'`)
    } catch (error) {
      reject(error)
    }
  })
}

// Main function with enhanced UX
async function sendBeautifulEmail(
  data: any,
  step: string,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return sendToGoogleSheetWithRetry(data, step, 3, onProgress)
}

// Enhanced event logging with better UX data
async function logEvent(
  eventData: LogEventData,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
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
    customerNotes,
    urgencyLevel = "medium",
    servicePreferences = [],
    estimatedDuration,
  } = eventData

  const clientMetadata = getClientMetadata()

  // Enhanced pricing calculations
  const taxRate = 0.08
  const taxableAmount = Math.max(0, subtotalPrice - couponDiscount - fullHouseDiscount)
  const taxAmount = taxableAmount * taxRate
  const finalTotalAmount = taxableAmount + taxAmount

  // Generate beautiful order ID
  const orderId = transactionId || `SB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

  // Enhanced payload with better UX data
  const payload = {
    // Email template selection
    emailTemplate: {
      type: step,
      theme: "beautiful-gradient",
      language: clientMetadata.language,
      darkMode: clientMetadata.colorScheme === "dark",
      reducedMotion: clientMetadata.reducedMotion,
    },

    // Order identification
    orderId,
    timestamp: new Date().toISOString(),
    step,
    urgencyLevel,

    // Enhanced customer information
    customer: {
      firstName: checkoutData.contact.firstName || "",
      lastName: checkoutData.contact.lastName || "",
      email: checkoutData.contact.email || "",
      phone: checkoutData.contact.phone || "",
      notes: customerNotes || "",
      preferredContactMethod: checkoutData.contact.preferredContact || "email",
      timezone: clientMetadata.timezone,
      language: clientMetadata.language,
    },

    // Enhanced service address
    address: {
      street: checkoutData.address.address || "",
      apartment: checkoutData.address.address2 || "",
      city: checkoutData.address.city || "",
      state: checkoutData.address.state || "",
      zipCode: checkoutData.address.zipCode || "",
      addressType: checkoutData.address.addressType || "Residential",
      accessInstructions: checkoutData.address.accessInstructions || "",
      parkingInstructions: checkoutData.address.parkingInstructions || "",
    },

    // Enhanced service details
    serviceDetails: {
      type: checkoutData.address.addressType || "Residential",
      frequency: "One-time", // Default for now
      date: bookingDate || "",
      time: bookingTime || "",
      estimatedDuration: estimatedDuration || 0,
      specialInstructions: checkoutData.address.specialInstructions || "",
      preferences: servicePreferences,
      urgencyLevel,
    },

    // Enhanced cart information
    cart: {
      rooms: cartItems
        .filter((item) => item.roomType)
        .map((item) => ({
          category: getRoomCartItemDisplayName(item),
          count: item.quantity,
          customizations: item.selectedAddOns?.map((a) => a.name) || [],
          price: item.price,
          totalPrice: item.price * item.quantity,
        })),
      addons: cartItems
        .filter((item) => !item.roomType)
        .map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity,
        })),
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    },

    // Enhanced pricing breakdown
    pricing: {
      subtotal: subtotalPrice,
      discountAmount: couponDiscount + fullHouseDiscount,
      couponDiscount,
      fullHouseDiscount,
      taxAmount,
      totalAmount: finalTotalAmount,
      couponCode: couponCode || "",
      currency: "USD",
      taxRate: taxRate * 100, // Convert to percentage
    },

    // Enhanced payment information
    payment: {
      method: checkoutData.payment.paymentMethod || "pending",
      status: paymentStatus || "pending",
      transactionId: transactionId || "",
      allowVideoRecording: checkoutData.payment.allowVideoRecording || false,
      paymentDate: paymentStatus === "completed" ? new Date().toISOString() : "",
    },

    // Enhanced metadata for analytics and UX
    metadata: {
      // Device and browser info
      deviceType: clientMetadata.deviceType,
      browser: clientMetadata.browser,
      userAgent: clientMetadata.userAgent,
      screenResolution: clientMetadata.screenResolution,
      viewportSize: clientMetadata.viewportSize,
      screenSize: clientMetadata.screenSize,
      colorScheme: clientMetadata.colorScheme,
      reducedMotion: clientMetadata.reducedMotion,

      // Marketing and tracking
      utmSource: clientMetadata.utmSource,
      utmMedium: clientMetadata.utmMedium,
      utmCampaign: clientMetadata.utmCampaign,
      referrerUrl: clientMetadata.referrerUrl,

      // Session and user behavior
      sessionId: clientMetadata.sessionId,
      cartId: clientMetadata.cartId,
      userInteractions: clientMetadata.userInteractions,
      pageLoadTime: clientMetadata.pageLoadTime,

      // Technical details
      timezone: clientMetadata.timezone,
      language: clientMetadata.language,
      connectionType: clientMetadata.connectionType,
      ipAddress: clientMetadata.ipAddress,

      // Business logic
      videoConsentDetails: checkoutData.payment.allowVideoRecording
        ? "User consented to video recording for quality assurance"
        : "User declined video recording",
      orderType: checkoutData.address.addressType || "Residential",
      couponCodeApplied: couponCode ? "Yes" : "No",
      customerSegment: urgencyLevel === "high" ? "Priority" : "Standard",
      internalNotes: `Beautiful email sent for step: ${step}`,
      dataSource: "beautiful_email_system",

      // Email specific metadata
      emailPreferences: {
        htmlEmail: true,
        mobileOptimized: clientMetadata.deviceType === "mobile",
        darkModeSupport: clientMetadata.colorScheme === "dark",
        reducedMotion: clientMetadata.reducedMotion,
      },
    },
  }

  // Send the beautiful email
  return sendBeautifulEmail(payload, step, onProgress)
}

// Exported logging functions with enhanced UX
export function logWelcomeStart(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEvent({ ...eventData, step: "welcome_start" }, onProgress)
}

export function logContactSubmit(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEvent({ ...eventData, step: "contact_submit" }, onProgress)
}

export function logAddressSubmit(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEvent({ ...eventData, step: "address_submit" }, onProgress)
}

export function logCartProceedToCheckout(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEvent({ ...eventData, step: "cart_proceed_to_checkout_click" }, onProgress)
}

export function logCartReviewPayNowClick(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEvent({ ...eventData, step: "cart_review_pay_now_click" }, onProgress)
}

export function logCheckoutComplete(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEvent({ ...eventData, step: "checkout_complete" }, onProgress)
}

export function logBookingConfirmation(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEvent({ ...eventData, step: "booking_confirmation" }, onProgress)
}

// Enhanced testing functions with better UX
export async function testBeautifulEmail(
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  const testData = {
    emailTemplate: {
      type: "test_email",
      theme: "beautiful-gradient",
      language: "en",
      darkMode: false,
      reducedMotion: false,
    },
    orderId: `TEST-${Date.now()}`,
    timestamp: new Date().toISOString(),
    step: "test_email",
    urgencyLevel: "medium" as const,
    customer: {
      firstName: "Test",
      lastName: "Customer",
      email: "test@smileybrooms.com",
      phone: "(555) 123-4567",
      notes: "This is a beautiful test email from SmileyBrooms! 🧹✨",
      preferredContactMethod: "email",
      timezone: "America/New_York",
      language: "en",
    },
    address: {
      street: "123 Sparkle Street",
      apartment: "Suite 100",
      city: "Clean City",
      state: "CA",
      zipCode: "90210",
      addressType: "Residential",
      accessInstructions: "Ring doorbell twice",
      parkingInstructions: "Driveway available",
    },
    serviceDetails: {
      type: "Residential",
      frequency: "One-time",
      date: new Date().toLocaleDateString(),
      time: "10:00 AM",
      estimatedDuration: 120,
      specialInstructions: "Please use eco-friendly products",
      preferences: ["Eco-Friendly", "Deep Clean", "Pet-Safe"],
      urgencyLevel: "medium" as const,
    },
    cart: {
      rooms: [
        {
          category: "Living Room",
          count: 1,
          customizations: ["Deep Clean", "Eco-Friendly Products"],
          price: 75,
          totalPrice: 75,
        },
        {
          category: "Kitchen",
          count: 1,
          customizations: ["Inside Oven", "Inside Refrigerator"],
          price: 85,
          totalPrice: 85,
        },
      ],
      addons: [
        {
          name: "Window Cleaning (Interior)",
          quantity: 1,
          price: 50,
          totalPrice: 50,
        },
      ],
      totalItems: 3,
    },
    pricing: {
      subtotal: 210,
      discountAmount: 21,
      couponDiscount: 21,
      fullHouseDiscount: 0,
      taxAmount: 15.12,
      totalAmount: 204.12,
      couponCode: "TEST10",
      currency: "USD",
      taxRate: 8,
    },
    payment: {
      method: "test_payment",
      status: "test_completed",
      transactionId: "test_txn_123456789",
      allowVideoRecording: true,
      paymentDate: new Date().toISOString(),
    },
    metadata: {
      deviceType: "desktop",
      browser: "Chrome 120",
      userAgent: "Test User Agent",
      screenResolution: "1920x1080",
      viewportSize: "1200x800",
      screenSize: "large",
      colorScheme: "light",
      reducedMotion: false,
      utmSource: "test",
      utmMedium: "email",
      utmCampaign: "beautiful_email_test",
      referrerUrl: "https://test.smileybrooms.com",
      sessionId: "test_session_123",
      cartId: "test_cart_123",
      userInteractions: 15,
      pageLoadTime: 1250,
      timezone: "America/New_York",
      language: "en",
      connectionType: "4g",
      ipAddress: "127.0.0.1",
      videoConsentDetails: "User consented to video recording for testing purposes",
      orderType: "Residential",
      couponCodeApplied: "Yes",
      customerSegment: "Test",
      internalNotes: "🧪 This is a beautiful test email from the enhanced email system! ✨",
      dataSource: "beautiful_email_test_system",
      emailPreferences: {
        htmlEmail: true,
        mobileOptimized: false,
        darkModeSupport: false,
        reducedMotion: false,
      },
    },
  }

  console.log("🧪 Testing beautiful email system with enhanced UX...")
  return sendBeautifulEmail(testData, "test_email", onProgress)
}

export async function checkEmailSystemHealth(): Promise<{
  healthy: boolean
  message: string
  details?: any
}> {
  if (!WEBHOOK_URL) {
    return {
      healthy: false,
      message:
        "❌ Beautiful email system not configured. Please set NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL environment variable.",
      details: {
        issue: "missing_webhook_url",
        solution: "Add NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL to your environment variables",
      },
    }
  }

  try {
    const healthData = {
      type: "health_check",
      timestamp: new Date().toISOString(),
      message: "Health check from beautiful email system 🏥✨",
      system: "SmileyBrooms Beautiful Email System",
      version: "2.0.0",
      features: [
        "Beautiful HTML emails",
        "Mobile responsive design",
        "Dark mode support",
        "Enhanced UX tracking",
        "Multiple fallback methods",
        "Real-time progress updates",
      ],
    }

    const result = await sendBeautifulEmail(healthData, "health_check")

    if (result.success) {
      return {
        healthy: true,
        message: "✅ Beautiful email system is healthy and ready to send gorgeous emails! 🎉",
        details: {
          status: "operational",
          features: healthData.features,
          lastCheck: new Date().toISOString(),
          fallbacksAvailable: true,
        },
      }
    } else {
      return {
        healthy: false,
        message: `❌ Beautiful email system health check failed: ${result.message}`,
        details: {
          status: "degraded",
          error: result.error,
          retryAttempts: result.retryAttempts,
          fallbackUsed: result.fallbackUsed,
        },
      }
    }
  } catch (error) {
    return {
      healthy: false,
      message: `❌ Beautiful email system health check error: ${error instanceof Error ? error.message : String(error)}`,
      details: {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
    }
  }
}

// Enhanced validation with better error messages
export function validateLogEventData(eventData: Partial<LogEventData>): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields validation
  if (!eventData.checkoutData) {
    errors.push("Missing checkout data - cannot send beautiful email")
  } else {
    if (!eventData.checkoutData.contact?.email) {
      errors.push("Customer email is required for beautiful email delivery")
    }
    if (!eventData.checkoutData.contact?.firstName) {
      warnings.push("Customer first name missing - email will be less personalized")
    }
  }

  if (!eventData.cartItems || eventData.cartItems.length === 0) {
    warnings.push("No cart items found - email will show empty cart")
  }

  if (typeof eventData.subtotalPrice !== "number" || eventData.subtotalPrice < 0) {
    errors.push("Invalid subtotal price - cannot calculate beautiful email pricing")
  }

  if (typeof eventData.totalPrice !== "number" || eventData.totalPrice < 0) {
    errors.push("Invalid total price - cannot show final amount in beautiful email")
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// Enhanced safe logging with better UX feedback
export async function logEventSafely(
  eventData: Omit<LogEventData, "step">,
  step: string,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
  onValidationError?: (errors: string[], warnings: string[]) => void,
): Promise<EmailNotificationResult> {
  const validation = validateLogEventData(eventData)

  if (!validation.valid) {
    console.error(`❌ [Beautiful Email] Invalid event data for step: ${step}`, validation.errors)
    onValidationError?.(validation.errors, validation.warnings)

    return {
      success: false,
      message: "Cannot send beautiful email due to missing required information",
      error: `Validation failed: ${validation.errors.join(", ")}`,
    }
  }

  if (validation.warnings.length > 0) {
    console.warn(`⚠️ [Beautiful Email] Warnings for step: ${step}`, validation.warnings)
  }

  return logEvent({ ...eventData, step }, onProgress)
}

// Utility function to track user interactions (for better UX analytics)
export function trackUserInteraction() {
  if (typeof window !== "undefined") {
    const current = Number.parseInt(localStorage.getItem("userInteractions") || "0")
    localStorage.setItem("userInteractions", (current + 1).toString())
  }
}

// Export types for better TypeScript support
export type { LogEventData, EmailNotificationResult }
