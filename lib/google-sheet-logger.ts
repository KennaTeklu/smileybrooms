import type { CheckoutData, CartItem } from "@/lib/types"
import { getRoomCartItemDisplayName } from "@/lib/cart/item-utils"
import { sendOrderEmailNotification, convertToEmailData } from "./email-service"

// Get the webhook URL from environment variables
const WEBHOOK_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL || ""
const GOOGLE_SHEET_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || "https://docs.google.com/spreadsheets/d/your-sheet-id"

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
  emailContent?: {
    subject: string
    preview: string
    htmlLength: number
  }
}

interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent: string
  priority: "high" | "normal" | "low"
  category: string
}

interface OrderData {
  orderId: string
  timestamp: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    notes?: string
  }
  address: {
    street: string
    apartment?: string
    city: string
    state: string
    zipCode: string
    addressType?: string
    accessInstructions?: string
    parkingInstructions?: string
  }
  serviceDetails: {
    type: string
    frequency: string
    date?: string
    time?: string
    specialInstructions?: string
    preferences?: string
  }
  cart: {
    rooms: Array<{
      name: string
      price: number
      quantity: number
    }>
    addons: Array<{
      name: string
      price: number
      quantity: number
    }>
    totalItems: number
  }
  pricing: {
    subtotal: number
    discountAmount?: number
    taxAmount?: number
    totalAmount: number
    couponCode?: string
  }
  payment: {
    method: string
    status: string
    transactionId?: string
    allowVideoRecording: boolean
  }
  metadata?: {
    source?: string
    deviceType?: string
    userAgent?: string
    referrer?: string
    sessionId?: string
    [key: string]: any
  }
}

interface AnalyticsData {
  eventType: string
  timestamp: string
  sessionId?: string
  userId?: string
  pageUrl?: string
  referrer?: string
  deviceType?: string
  userAgent?: string
  customData?: Record<string, any>
}

const GOOGLE_APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL || process.env.APPS_SCRIPT_WEB_APP_URL

// Rate limiting for Google Sheets API
const rateLimiter = {
  lastRequest: 0,
  requestCount: 0,
  resetTime: 0,
  MAX_REQUESTS_PER_MINUTE: 30, // Conservative limit
  MIN_REQUEST_INTERVAL: 2000, // 2 seconds between requests
}

// Check if we can make a request
function canMakeRequest(): boolean {
  const now = Date.now()

  // Reset counter every minute
  if (now > rateLimiter.resetTime) {
    rateLimiter.requestCount = 0
    rateLimiter.resetTime = now + 60000 // Next minute
  }

  // Check rate limits
  if (rateLimiter.requestCount >= rateLimiter.MAX_REQUESTS_PER_MINUTE) {
    console.warn("🚫 Rate limit exceeded - skipping Google Sheets request")
    return false
  }

  if (now - rateLimiter.lastRequest < rateLimiter.MIN_REQUEST_INTERVAL) {
    console.warn("🚫 Request too soon - skipping Google Sheets request")
    return false
  }

  return true
}

// Update rate limiter after successful request
function updateRateLimiter(): void {
  rateLimiter.lastRequest = Date.now()
  rateLimiter.requestCount++
}

// Enhanced client metadata with comprehensive tracking
function getComprehensiveClientMetadata(): any {
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
      viewportSize: "unknown",
      colorScheme: "light",
      reducedMotion: false,
    }
  }

  const userAgent = navigator.userAgent
  const platform = navigator.platform
  const language = navigator.language
  const languages = navigator.languages || [language]

  // Enhanced device detection
  let deviceType: "mobile" | "tablet" | "desktop" | "tv" | "unknown" = "unknown"
  let browserName = "unknown"
  let browserVersion = ""
  let osName = "unknown"
  let osVersion = ""
  let engineName = "unknown"
  const engineVersion = ""

  // Device type detection
  if (/Mobile|Android|iPhone|iPod/i.test(userAgent)) {
    deviceType = "mobile"
  } else if (/Tablet|iPad/i.test(userAgent)) {
    deviceType = "tablet"
  } else if (/TV|Television/i.test(userAgent)) {
    deviceType = "tv"
  } else {
    deviceType = "desktop"
  }

  // Browser detection
  if (userAgent.includes("Chrome") && !userAgent.includes("Edge") && !userAgent.includes("OPR")) {
    browserName = "Chrome"
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/)
    browserVersion = match ? match[1] : ""
    engineName = "Blink"
  } else if (userAgent.includes("Firefox")) {
    browserName = "Firefox"
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/)
    browserVersion = match ? match[1] : ""
    engineName = "Gecko"
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browserName = "Safari"
    const match = userAgent.match(/Version\/(\d+\.\d+)/)
    browserVersion = match ? match[1] : ""
    engineName = "WebKit"
  } else if (userAgent.includes("Edge")) {
    browserName = "Edge"
    const match = userAgent.match(/Edge\/(\d+\.\d+)/)
    browserVersion = match ? match[1] : ""
    engineName = "EdgeHTML"
  } else if (userAgent.includes("OPR")) {
    browserName = "Opera"
    const match = userAgent.match(/OPR\/(\d+\.\d+)/)
    browserVersion = match ? match[1] : ""
    engineName = "Blink"
  }

  // OS detection
  if (userAgent.includes("Windows NT")) {
    osName = "Windows"
    const match = userAgent.match(/Windows NT (\d+\.\d+)/)
    osVersion = match ? match[1] : ""
  } else if (userAgent.includes("Mac OS X")) {
    osName = "macOS"
    const match = userAgent.match(/Mac OS X (\d+[._]\d+[._]\d+)/)
    osVersion = match ? match[1].replace(/_/g, ".") : ""
  } else if (userAgent.includes("Linux")) {
    osName = "Linux"
  } else if (userAgent.includes("Android")) {
    osName = "Android"
    const match = userAgent.match(/Android (\d+\.\d+)/)
    osVersion = match ? match[1] : ""
  } else if (userAgent.includes("iOS") || userAgent.includes("iPhone OS")) {
    osName = "iOS"
    const match = userAgent.match(/OS (\d+_\d+)/)
    osVersion = match ? match[1].replace(/_/g, ".") : ""
  }

  // Network information
  const connection =
    (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  const networkInfo = {
    connectionType: connection?.type || "unknown",
    effectiveType: connection?.effectiveType || "unknown",
    downlink: connection?.downlink || 0,
    rtt: connection?.rtt || 0,
    saveData: connection?.saveData || false,
    onLine: navigator.onLine,
  }

  // Screen and viewport information
  const screen = window.screen
  const screenInfo = {
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    screenPixelDepth: screen.pixelDepth,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    availableScreenWidth: screen.availWidth,
    availableScreenHeight: screen.availHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
  }

  // URL parameters and attribution
  const urlParams = new URLSearchParams(window.location.search)
  const attribution = {
    utmSource: urlParams.get("utm_source") || "",
    utmMedium: urlParams.get("utm_medium") || "",
    utmCampaign: urlParams.get("utm_campaign") || "",
    utmTerm: urlParams.get("utm_term") || "",
    utmContent: urlParams.get("utm_content") || "",
    gclid: urlParams.get("gclid") || "",
    fbclid: urlParams.get("fbclid") || "",
    referrerDomain: document.referrer ? new URL(document.referrer).hostname : "",
    referrerPath: document.referrer ? new URL(document.referrer).pathname : "",
  }

  // Session management
  const sessionId =
    localStorage.getItem("sessionId") || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const visitId = sessionStorage.getItem("visitId") || `visit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", sessionId)
  }
  if (!sessionStorage.getItem("visitId")) {
    sessionStorage.setItem("visitId", visitId)
  }

  const cartId = localStorage.getItem("cartId") || `cart-${sessionId}`
  if (!localStorage.getItem("cartId")) {
    localStorage.setItem("cartId", cartId)
  }

  return {
    // Legacy fields for compatibility
    deviceType,
    browser: `${browserName} ${browserVersion}`.trim(),
    userAgent,
    utmSource: attribution.utmSource,
    utmMedium: attribution.utmMedium,
    utmCampaign: attribution.utmCampaign,
    referrerUrl: document.referrer,
    sessionId,
    cartId,
    ipAddress: "client-side",
    screenResolution: `${screenInfo.screenWidth}x${screenInfo.screenHeight}`,
    viewportSize: `${screenInfo.viewportWidth}x${screenInfo.viewportHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language,
    connectionType: networkInfo.connectionType,
    pageLoadTime: Math.round(performance.now()),
    userInteractions: Number.parseInt(localStorage.getItem("userInteractions") || "0"),
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
    console.warn("🚫 [Apps Script] Webhook URL not configured")
    return {
      success: false,
      message: "Email system not configured. Please contact support.",
      error: "WEBHOOK_URL_MISSING",
    }
  }

  // Check rate limiting
  if (!canMakeRequest()) {
    return {
      success: false,
      message: "Request rate limited to prevent server overload",
      error: "RATE_LIMITED",
    }
  }

  let lastError: any = null
  const fallbackUsed = false

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      onProgress?.(attempt, maxRetries, "no-cors")
      console.log(`✨ [Apps Script] Sending data (${attempt}/${maxRetries}) for '${step}'`)

      // Primary method: no-cors (most reliable for Google Apps Script)
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "SmileyBrooms-Apps-Script",
          "X-Data-Type": data.event_type || "unknown",
        },
        body: JSON.stringify(data),
      })

      // Update rate limiter
      updateRateLimiter()

      console.log(`🎉 [Apps Script] Data sent successfully for '${step}' (attempt ${attempt})`)

      return {
        success: true,
        message: `Data sent to Apps Script successfully! 📧✨`,
        retryAttempts: attempt,
        fallbackUsed,
      }
    } catch (error) {
      lastError = error
      console.error(`❌ [Apps Script] Attempt ${attempt} failed for '${step}':`, error)

      if (attempt === maxRetries) {
        console.error(`❌ [Apps Script] All methods failed for '${step}':`, error)

        return {
          success: false,
          message: "Unable to send data to Apps Script. Our team has been notified.",
          error: `All delivery methods failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
          retryAttempts: attempt,
          fallbackUsed: false,
        }
      }

      // Exponential backoff with jitter
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  return {
    success: false,
    message: "Data delivery failed after all retry attempts.",
    error: `Max retries exceeded: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    retryAttempts: maxRetries,
    fallbackUsed,
  }
}

// Main function with enhanced UX
async function sendToAppsScript(
  data: any,
  step: string,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return sendToGoogleSheetWithRetry(data, step, 3, onProgress)
}

// Enhanced event logging that matches your Apps Script structure
export async function logEvent(
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

  const clientMetadata = getComprehensiveClientMetadata()

  // Enhanced pricing calculations
  const taxRate = 0.08
  const taxableAmount = Math.max(0, subtotalPrice - couponDiscount - fullHouseDiscount)
  const taxAmount = taxableAmount * taxRate
  const finalTotalAmount = taxableAmount + taxAmount

  // Generate order ID that matches your Apps Script format
  const orderId = transactionId || `SB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

  // Structure data exactly as your Apps Script expects
  const payload = {
    // Order identification
    orderId,
    orderStatus: paymentStatus === "completed" ? "Completed" : "Pending",
    timestamp: new Date().toISOString(),
    step,
    urgencyLevel,

    // Customer information (matches your processOrderData function)
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

    // Service address (matches your processOrderData function)
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

    // Service details (matches your processOrderData function)
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

    // Cart information (matches your processOrderData function)
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

    // Pricing breakdown (matches your processOrderData function)
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

    // Payment information (matches your processOrderData function)
    payment: {
      method: checkoutData.payment.paymentMethod || "pending",
      status: paymentStatus || "pending",
      transactionId: transactionId || "",
      allowVideoRecording: checkoutData.payment.allowVideoRecording || false,
      paymentDate: paymentStatus === "completed" ? new Date().toISOString() : "",
    },

    // Metadata for analytics (matches your processOrderData function)
    metadata: {
      // Device and browser info
      deviceType: clientMetadata.deviceType,
      browser: clientMetadata.browser,
      userAgent: clientMetadata.userAgent,
      screenResolution: clientMetadata.screenResolution,
      viewportSize: clientMetadata.viewportSize,
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
      internalNotes: `Data sent for step: ${step}`,
      dataSource: "enhanced_checkout_form",
    },
  }

  // Send to Apps Script
  return sendToAppsScript(payload, step, onProgress)
}

// Main logging function for analytics data
interface LogData {
  [key: string]: any
}

export async function logToGoogleSheet(data: LogData): Promise<boolean> {
  try {
    // Check rate limiting first
    if (!canMakeRequest()) {
      console.warn("🚫 Rate limited - skipping Google Sheets request")
      return storeFailedLog(data, "rate_limited")
    }

    // Get the Apps Script Web App URL from environment variables
    const webAppUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL

    if (!webAppUrl) {
      console.warn("Apps Script Web App URL not configured")
      return storeFailedLog(data, "missing_url")
    }

    // Validate URL format
    if (!webAppUrl.startsWith("https://script.google.com/")) {
      console.warn("Invalid Apps Script URL format")
      return storeFailedLog(data, "invalid_url")
    }

    // Prepare the data with timestamp and additional metadata
    const logEntry = {
      timestamp: new Date().toISOString(),
      local_timestamp: new Date().toLocaleString(),
      utc_timestamp: new Date().toUTCString(),
      unix_timestamp: Date.now(),
      ...data,
      // Add some computed fields
      user_agent_short: data.user_agent ? data.user_agent.substring(0, 100) : undefined,
      session_id_short: data.session_id ? data.session_id.substring(0, 20) : undefined,
      visitor_id_short: data.visitor_id ? data.visitor_id.substring(0, 20) : undefined,
      // Add engagement score
      engagement_score: calculateEngagementScore(data),
      // Add device category
      device_category: categorizeDevice(data),
      // Add location string
      location_string: formatLocationString(data),
      // Add performance category
      performance_category: categorizePerformance(data),
      // Add behavior category
      behavior_category: categorizeBehavior(data),
    }

    // Send to Google Apps Script with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "SmileyBrooms-Analytics",
          "X-Event-Type": data.event_type || "unknown",
        },
        body: JSON.stringify(logEntry),
        mode: "no-cors", // Required for Apps Script
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Update rate limiter
      updateRateLimiter()

      // Since we're using no-cors, we can't read the response
      // But we can assume success if no error was thrown
      console.log("📊 Analytics data sent to Google Sheets:", {
        event_type: data.event_type,
        page_path: data.page_path,
        timestamp: logEntry.timestamp,
      })

      return true
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError.name === "AbortError") {
        console.warn("⏰ Google Sheets request timed out")
        return storeFailedLog(data, "timeout")
      }

      throw fetchError
    }
  } catch (error) {
    console.error("Failed to log to Google Sheet:", error)

    // Determine error type for better handling
    let errorType = "unknown_error"
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      errorType = "network_error"
    } else if (error.name === "AbortError") {
      errorType = "timeout"
    }

    return storeFailedLog(data, errorType, error instanceof Error ? error.message : "Unknown error")
  }
}

// Helper function to store failed logs
function storeFailedLog(data: LogData, reason: string, errorMessage?: string): boolean {
  try {
    const failedLogs = JSON.parse(localStorage.getItem("failed_analytics_logs") || "[]")
    failedLogs.push({
      data,
      timestamp: Date.now(),
      reason,
      error: errorMessage,
    })

    // Keep only last 100 failed logs
    if (failedLogs.length > 100) {
      failedLogs.splice(0, failedLogs.length - 100)
    }

    localStorage.setItem("failed_analytics_logs", JSON.stringify(failedLogs))
    console.log(`📝 Stored failed log for later retry: ${reason}`)
    return false
  } catch (storageError) {
    console.error("Failed to store failed log:", storageError)
    return false
  }
}

// Calculate engagement score based on user behavior
function calculateEngagementScore(data: LogData): number {
  let score = 0

  // Time on page (max 30 points)
  if (data.time_on_page) {
    score += Math.min(data.time_on_page / 10, 30)
  }

  // Scroll depth (max 20 points)
  if (data.max_scroll_depth) {
    score += (data.max_scroll_depth / 100) * 20
  }

  // Interactions (max 30 points)
  const interactions = (data.click_events || 0) + (data.keyboard_events || 0) + (data.form_interactions || 0)
  score += Math.min(interactions * 2, 30)

  // Page views in session (max 20 points)
  if (data.page_views_session) {
    score += Math.min(data.page_views_session * 5, 20)
  }

  return Math.round(score)
}

// Categorize device for easier analysis
function categorizeDevice(data: LogData): string {
  const deviceType = data.device_type || "unknown"
  const screenWidth = data.screen_width || 0

  if (deviceType === "mobile") {
    return screenWidth > 400 ? "large-mobile" : "small-mobile"
  } else if (deviceType === "tablet") {
    return screenWidth > 800 ? "large-tablet" : "small-tablet"
  } else if (deviceType === "desktop") {
    if (screenWidth > 1920) return "large-desktop"
    if (screenWidth > 1366) return "medium-desktop"
    return "small-desktop"
  }

  return "unknown"
}

// Format location string for easier reading
function formatLocationString(data: LogData): string {
  const parts = []

  if (data.city) parts.push(data.city)
  if (data.state) parts.push(data.state)
  if (data.country) parts.push(data.country)

  return parts.join(", ") || "Unknown"
}

// Categorize performance
function categorizePerformance(data: LogData): string {
  const loadTime = data.page_load_time || 0

  if (loadTime < 1000) return "excellent"
  if (loadTime < 2500) return "good"
  if (loadTime < 4000) return "fair"
  return "poor"
}

// Categorize user behavior
function categorizeBehavior(data: LogData): string {
  const timeOnPage = data.time_on_page || 0
  const scrollDepth = data.max_scroll_depth || 0
  const interactions = (data.click_events || 0) + (data.keyboard_events || 0)

  if (timeOnPage < 10 && scrollDepth < 25 && interactions === 0) {
    return "bounce"
  } else if (timeOnPage > 60 && scrollDepth > 75) {
    return "highly-engaged"
  } else if (timeOnPage > 30 && scrollDepth > 50) {
    return "engaged"
  } else if (timeOnPage > 15 || scrollDepth > 25) {
    return "moderately-engaged"
  }

  return "low-engagement"
}

// Retry failed logs with rate limiting
export async function retryFailedLogs(): Promise<void> {
  try {
    const failedLogs = JSON.parse(localStorage.getItem("failed_analytics_logs") || "[]")

    if (failedLogs.length === 0) return

    console.log(`🔄 Retrying ${failedLogs.length} failed analytics logs...`)

    const successfulRetries = []
    let retriedCount = 0
    const maxRetries = 5 // Limit retries to prevent overwhelming

    for (const failedLog of failedLogs) {
      if (retriedCount >= maxRetries) break

      if (canMakeRequest()) {
        const success = await logToGoogleSheet(failedLog.data)
        if (success) {
          successfulRetries.push(failedLog)
          retriedCount++
        }

        // Small delay between retries
        await new Promise((resolve) => setTimeout(resolve, 500))
      } else {
        break // Stop if rate limited
      }
    }

    // Remove successful retries from failed logs
    const remainingFailedLogs = failedLogs.filter((log) => !successfulRetries.includes(log))
    localStorage.setItem("failed_analytics_logs", JSON.stringify(remainingFailedLogs))

    if (successfulRetries.length > 0) {
      console.log(`✅ Successfully retried ${successfulRetries.length} failed logs`)
    }
  } catch (error) {
    console.error("Failed to retry failed logs:", error)
  }
}

// Initialize retry mechanism with rate limiting
if (typeof window !== "undefined") {
  // Retry failed logs on page load (after a delay)
  setTimeout(retryFailedLogs, 10000) // Wait 10 seconds after page load

  // Retry failed logs periodically (less frequently)
  setInterval(retryFailedLogs, 600000) // Every 10 minutes
}

// Check if Google Sheets integration is properly configured
export function checkGoogleSheetsConfig(): {
  configured: boolean
  url?: string
  issues: string[]
} {
  const issues: string[] = []
  const webAppUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL

  if (!webAppUrl) {
    issues.push("NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL environment variable is not set")
    return { configured: false, issues }
  }

  if (!webAppUrl.startsWith("https://script.google.com/")) {
    issues.push("Apps Script URL should start with 'https://script.google.com/'")
  }

  if (!webAppUrl.includes("/exec")) {
    issues.push("Apps Script URL should end with '/exec' for web app deployment")
  }

  return {
    configured: issues.length === 0,
    url: webAppUrl,
    issues,
  }
}

// Initialize Google Sheets integration check on client side
if (typeof window !== "undefined") {
  const config = checkGoogleSheetsConfig()
  if (!config.configured) {
    console.warn("⚠️ Google Sheets integration not properly configured:", config.issues)
  } else {
    console.log("✅ Google Sheets integration configured:", config.url)
  }
}

// Export types for better TypeScript support
export type { LogEventData, EmailNotificationResult, OrderData, AnalyticsData }

// Send order data to Google Apps Script with business email template AND send email notification
export async function logOrderToGoogleSheets(orderData: OrderData): Promise<boolean> {
  try {
    if (!GOOGLE_APPS_SCRIPT_URL) {
      console.warn("⚠️ Google Apps Script URL not configured")
      return false
    }

    // Log to Google Sheets
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "logOrder",
        data: orderData,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      console.log("✅ Order logged to Google Sheets successfully")

      // Send email notification for orders
      try {
        const emailData = convertToEmailData(orderData)
        const emailSent = await sendOrderEmailNotification(emailData)

        if (emailSent) {
          console.log("✅ Order email notification sent successfully")
        } else {
          console.warn("⚠️ Order email notification failed to send")
        }
      } catch (emailError) {
        console.error("❌ Error sending order email notification:", emailError)
      }

      return true
    } else {
      throw new Error(result.error || "Unknown error occurred")
    }
  } catch (error) {
    console.error("❌ Failed to log order to Google Sheets:", error)
    return false
  }
}

export async function logAnalyticsToGoogleSheets(analyticsData: AnalyticsData): Promise<boolean> {
  try {
    if (!GOOGLE_APPS_SCRIPT_URL) {
      console.warn("⚠️ Google Apps Script URL not configured")
      return false
    }

    // Only log analytics to Google Sheets (no email for analytics)
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "logAnalytics",
        data: analyticsData,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      console.log("✅ Analytics logged to Google Sheets successfully")
      return true
    } else {
      throw new Error(result.error || "Unknown error occurred")
    }
  } catch (error) {
    console.error("❌ Failed to log analytics to Google Sheets:", error)
    return false
  }
}

export async function logContactFormToGoogleSheets(contactData: any): Promise<boolean> {
  try {
    if (!GOOGLE_APPS_SCRIPT_URL) {
      console.warn("⚠️ Google Apps Script URL not configured")
      return false
    }

    // Log contact form to Google Sheets (no email for contact forms)
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "logContact",
        data: contactData,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      console.log("✅ Contact form logged to Google Sheets successfully")
      return true
    } else {
      throw new Error(result.error || "Unknown error occurred")
    }
  } catch (error) {
    console.error("❌ Failed to log contact form to Google Sheets:", error)
    return false
  }
}

// Helper function to generate order ID
export function generateOrderId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `SB-${timestamp}-${random}`
}

// Helper function to get device type from user agent
export function getDeviceType(userAgent?: string): string {
  if (!userAgent) return "unknown"

  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios"
  if (/Android/i.test(userAgent)) return "android"
  if (/Windows|Mac|Linux/i.test(userAgent)) return "desktop"

  return "unknown"
}

// Helper function to create order data from cart and customer info
export function createOrderData(cart: any, customer: any, address: any, payment: any, metadata?: any): OrderData {
  const orderId = generateOrderId()
  const timestamp = new Date().toISOString()

  // Calculate pricing
  const subtotal = cart.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || 0
  const discountAmount = payment.allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
  const taxAmount = (subtotal - discountAmount) * 0.08
  const totalAmount = subtotal - discountAmount + taxAmount

  return {
    orderId,
    timestamp,
    customer: {
      firstName: customer.firstName || customer.name?.split(" ")[0] || "",
      lastName: customer.lastName || customer.name?.split(" ").slice(1).join(" ") || "",
      email: customer.email || "",
      phone: customer.phone || "",
      notes: customer.notes,
    },
    address: {
      street: address.street || address.line1 || "",
      apartment: address.apartment || address.line2,
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || address.postal_code || "",
      addressType: address.addressType,
      accessInstructions: address.accessInstructions,
      parkingInstructions: address.parkingInstructions,
    },
    serviceDetails: {
      type: "Cleaning Service",
      frequency: "One-time",
      date: metadata?.preferredDate,
      time: metadata?.preferredTime,
      specialInstructions: address.specialInstructions || metadata?.specialInstructions,
      preferences: metadata?.preferences,
    },
    cart: {
      rooms: cart.items?.filter((item: any) => item.category === "room") || [],
      addons: cart.items?.filter((item: any) => item.category === "addon") || [],
      totalItems: cart.items?.length || 0,
    },
    pricing: {
      subtotal,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      taxAmount,
      totalAmount,
      couponCode: payment.couponCode,
    },
    payment: {
      method: payment.method || "unknown",
      status: payment.status || "pending",
      transactionId: payment.transactionId,
      allowVideoRecording: payment.allowVideoRecording || false,
    },
    metadata: {
      source: "website",
      deviceType: metadata?.deviceType || getDeviceType(metadata?.userAgent),
      userAgent: metadata?.userAgent,
      referrer: metadata?.referrer,
      sessionId: metadata?.sessionId,
      ...metadata,
    },
  }
}
