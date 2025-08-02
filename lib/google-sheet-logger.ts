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
  // Customer Information
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    notes?: string
    preferredContactMethod?: string
    timezone?: string
  }

  // Service Address
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

  // Service Details
  serviceDetails: {
    type: string
    frequency: string
    date?: string
    time?: string
    estimatedDuration?: string
    specialInstructions?: string
    preferences?: string[]
    urgencyLevel?: "low" | "medium" | "high" | "urgent"
  }

  // Cart Information
  cart: {
    rooms: Array<{
      category: string
      count: number
      customizations?: string[]
    }>
    addons: Array<{
      name: string
      quantity: number
      price?: number
      totalPrice?: number
    }>
    totalItems: number
  }

  // Pricing Details
  pricing: {
    subtotal: number
    couponDiscount?: number
    fullHouseDiscount?: number
    discountAmount?: number
    taxRate?: number
    taxAmount?: number
    totalAmount: number
    currency: string
    couponCode?: string
  }

  // Payment Information
  payment: {
    method: string
    status: string
    transactionId?: string
    paymentDate?: string
    allowVideoRecording?: boolean
  }

  // Metadata
  metadata: {
    deviceType?: string
    browser?: string
    ipAddress?: string
    userAgent?: string
    screenResolution?: string
    viewportSize?: string
    colorScheme?: string
    videoConsentDetails?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    referrerUrl?: string
    sessionId?: string
    cartId?: string
    userInteractions?: number
    pageLoadTime?: number
    internalNotes?: string
  }

  // Order Metadata
  orderId?: string
  orderStatus?: string
}

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

// Exported logging functions
export function logWelcomeStart(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEventSafely({ ...eventData, step: "welcome_start" }, "welcome_start", onProgress)
}

export function logContactSubmit(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEventSafely({ ...eventData, step: "contact_submit" }, "contact_submit", onProgress)
}

export function logAddressSubmit(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEventSafely({ ...eventData, step: "address_submit" }, "address_submit", onProgress)
}

export function logCartProceedToCheckout(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEventSafely(
    { ...eventData, step: "cart_proceed_to_checkout_click" },
    "cart_proceed_to_checkout_click",
    onProgress,
  )
}

export function logCartReviewPayNowClick(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEventSafely({ ...eventData, step: "cart_review_pay_now_click" }, "cart_review_pay_now_click", onProgress)
}

export function logCheckoutComplete(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEventSafely({ ...eventData, step: "checkout_complete" }, "checkout_complete", onProgress)
}

export function logBookingConfirmation(
  eventData: Omit<LogEventData, "step">,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  return logEventSafely({ ...eventData, step: "booking_confirmation" }, "booking_confirmation", onProgress)
}

// Enhanced testing function
export async function testAppsScript(
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
): Promise<EmailNotificationResult> {
  const testData = {
    orderId: `TEST-${Date.now()}`,
    timestamp: new Date().toISOString(),
    step: "test_email",
    urgencyLevel: "medium" as const,
    customer: {
      firstName: "Test",
      lastName: "Customer",
      email: "test@smileybrooms.com",
      phone: "(555) 123-4567",
      notes: "This is a test from the updated system! 🧹✨",
      preferredContactMethod: "email",
      timezone: "America/New_York",
      language: "en",
    },
    address: {
      street: "123 Test Street",
      apartment: "Suite 100",
      city: "Test City",
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
      ],
      addons: [
        {
          name: "Window Cleaning (Interior)",
          quantity: 1,
          price: 50,
          totalPrice: 50,
        },
      ],
      totalItems: 2,
    },
    pricing: {
      subtotal: 125,
      discountAmount: 12.5,
      couponDiscount: 12.5,
      fullHouseDiscount: 0,
      taxAmount: 9.0,
      totalAmount: 121.5,
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
      colorScheme: "light",
      reducedMotion: false,
      utmSource: "test",
      utmMedium: "email",
      utmCampaign: "apps_script_test",
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
      internalNotes: "🧪 This is a test from the updated Apps Script integration! ✨",
      dataSource: "enhanced_checkout_form",
    },
  }

  console.log("🧪 Testing Apps Script integration...")
  return sendToAppsScript(testData, "test_email", onProgress)
}

export async function checkAppsScriptHealth(): Promise<{
  healthy: boolean
  message: string
  details?: any
}> {
  if (!WEBHOOK_URL) {
    return {
      healthy: false,
      message: "❌ Apps Script not configured. Please set NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL environment variable.",
      details: {
        issue: "missing_webhook_url",
        solution: "Add NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL to your environment variables",
      },
    }
  }

  try {
    const response = await fetch(`${WEBHOOK_URL}?health=check`, {
      method: "GET",
      mode: "cors",
    })

    if (response.ok) {
      const result = await response.json()
      return {
        healthy: true,
        message: "✅ Apps Script is healthy and ready! 🎉",
        details: {
          status: "operational",
          version: result.version || "3.0.0",
          features: result.features || [],
          lastCheck: new Date().toISOString(),
        },
      }
    } else {
      return {
        healthy: false,
        message: `❌ Apps Script health check failed: HTTP ${response.status}`,
        details: {
          status: "degraded",
          httpStatus: response.status,
          statusText: response.statusText,
        },
      }
    }
  } catch (error) {
    return {
      healthy: false,
      message: `❌ Apps Script health check error: ${error instanceof Error ? error.message : String(error)}`,
      details: {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
    }
  }
}

// Enhanced validation
export function validateLogEventData(eventData: Partial<LogEventData>): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields validation
  if (!eventData.checkoutData) {
    errors.push("Missing checkout data - cannot send to Apps Script")
  } else {
    if (!eventData.checkoutData.contact?.email) {
      errors.push("Customer email is required for Apps Script processing")
    }
    if (!eventData.checkoutData.contact?.firstName) {
      warnings.push("Customer first name missing - email will be less personalized")
    }
  }

  if (!eventData.cartItems || eventData.cartItems.length === 0) {
    warnings.push("No cart items found - Apps Script will show empty cart")
  }

  if (typeof eventData.subtotalPrice !== "number" || eventData.subtotalPrice < 0) {
    errors.push("Invalid subtotal price - cannot calculate pricing for Apps Script")
  }

  if (typeof eventData.totalPrice !== "number" || eventData.totalPrice < 0) {
    errors.push("Invalid total price - cannot show final amount in Apps Script")
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// Enhanced safe logging
export async function logEventSafely(
  eventData: Omit<LogEventData, "step">,
  step: string,
  onProgress?: (attempt: number, maxAttempts: number, method: string) => void,
  onValidationError?: (errors: string[], warnings: string[]) => void,
): Promise<EmailNotificationResult> {
  const validation = validateLogEventData(eventData)

  if (!validation.valid) {
    console.error(`❌ [Apps Script] Invalid event data for step: ${step}`, validation.errors)
    onValidationError?.(validation.errors, validation.warnings)

    return {
      success: false,
      message: "Cannot send to Apps Script due to missing required information",
      error: `Validation failed: ${validation.errors.join(", ")}`,
    }
  }

  if (validation.warnings.length > 0) {
    console.warn(`⚠️ [Apps Script] Warnings for step: ${step}`, validation.warnings)
  }

  return logEvent({ ...eventData, step }, onProgress)
}

// Utility function to track user interactions
export function trackUserInteraction() {
  if (typeof window !== "undefined") {
    const current = Number.parseInt(localStorage.getItem("userInteractions") || "0")
    localStorage.setItem("userInteractions", (current + 1).toString())
  }
}

/**
 * Send order data to Google Apps Script with business email template AND send email notification
 */
export async function logOrderToGoogleSheets(orderData: OrderData): Promise<{ success: boolean; orderId: string }> {
  const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL

  if (!appsScriptUrl) {
    console.error("Google Apps Script URL not configured")
    throw new Error("Google Apps Script URL not configured")
  }

  try {
    // Check rate limiting
    if (!canMakeRequest()) {
      throw new Error("Request rate limited to prevent server overload")
    }

    // Prepare the payload
    const payload = {
      ...orderData,
      timestamp: new Date().toISOString(),
      dataSource: "enhanced_checkout_form",
      emailSystemVersion: "3.0.0",
    }

    console.log("Sending order to Google Sheets...")

    // Send to Google Sheets
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "SmileyBrooms-Order",
      },
      body: JSON.stringify(payload),
      mode: "no-cors",
    })

    // Update rate limiter
    updateRateLimiter()

    // Since we're using no-cors, assume success if no error thrown
    const orderId = orderData.orderId || `SB-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    console.log("✅ Order logged successfully to Google Sheets:", orderId)

    // Also send email notification to smileybrooms@gmail.com
    try {
      const emailData = convertToEmailData(orderData)
      const emailResult = await sendOrderEmailNotification(emailData)

      if (emailResult.success) {
        console.log("✅ Order email notification sent successfully")
      } else {
        console.warn("⚠️ Order email notification failed:", emailResult.error)
      }
    } catch (emailError) {
      console.error("❌ Failed to send order email notification:", emailError)
      // Don't throw error here - we still want to return success for Google Sheets logging
    }

    return { success: true, orderId }
  } catch (error) {
    console.error("❌ Failed to log order to Google Sheets:", error)
    throw error
  }
}

/**
 * Test the Google Apps Script connection
 */
export async function testGoogleSheetsConnection(): Promise<boolean> {
  const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL

  if (!appsScriptUrl) {
    console.error("Google Apps Script URL not configured")
    return false
  }

  try {
    // Check rate limiting
    if (!canMakeRequest()) {
      console.warn("Rate limited - cannot test connection")
      return false
    }

    const response = await fetch(`${appsScriptUrl}?health=check`, {
      mode: "no-cors",
    })

    // Update rate limiter
    updateRateLimiter()

    console.log("Apps Script Health Check completed")
    return true // Assume success with no-cors
  } catch (error) {
    console.error("Apps Script health check failed:", error)
    return false
  }
}

// Export types for better TypeScript support
export type { LogEventData, EmailNotificationResult, OrderData }
