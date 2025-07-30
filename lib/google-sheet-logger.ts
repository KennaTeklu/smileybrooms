import type { CheckoutData, CartItem } from "@/lib/types"
import { getRoomCartItemDisplayName } from "@/lib/cart/item-utils"

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
      viewportSize: "unknown",
      colorScheme: "light",
      reducedMotion: false,
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

/**
 * Generate a clean, business-focused email template that matches the Apps Script styling
 */
function generateBusinessEmailTemplate(data: OrderData): { htmlContent: string; textContent: string; subject: string } {
  const customerName = `${data.customer.firstName} ${data.customer.lastName}`.trim() || "Customer"
  const urgencyLevel = data.serviceDetails.urgencyLevel?.toLowerCase() || "medium"
  const isUrgent = urgencyLevel === "high" || urgencyLevel === "urgent"
  const orderId = data.orderId || `SB-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  // Helper function to check if content exists
  const hasContent = (value: any): boolean => {
    return value && value !== "" && value !== "0" && value !== "None" && value !== "Not specified"
  }

  // Build conditional content sections
  const contentSections: string[] = []

  // Essential Info (always shown)
  const essentialInfo = `
    <div style="background: #f8f9fa; border-left: 4px solid ${isUrgent ? "#dc3545" : "#28a745"}; padding: 16px; margin-bottom: 16px; border-radius: 0 8px 8px 0;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; font-size: 14px;">
        <div><strong>Order:</strong> ${orderId}</div>
        <div><strong>Total:</strong> $${Number(data.pricing.totalAmount || 0).toFixed(2)} ${data.pricing.currency || "USD"}</div>
        <div><strong>Customer:</strong> ${customerName}</div>
        <div><strong>Priority:</strong> <span style="color: ${isUrgent ? "#dc3545" : "#28a745"}; font-weight: bold;">${urgencyLevel.toUpperCase()}</span></div>
      </div>
    </div>`
  contentSections.push(essentialInfo)

  // Contact Info (if available)
  const contactFields: string[] = []
  if (hasContent(data.customer.email)) contactFields.push(`<div><strong>Email:</strong> ${data.customer.email}</div>`)
  if (hasContent(data.customer.phone)) contactFields.push(`<div><strong>Phone:</strong> ${data.customer.phone}</div>`)
  if (hasContent(data.customer.preferredContactMethod))
    contactFields.push(`<div><strong>Preferred:</strong> ${data.customer.preferredContactMethod}</div>`)
  if (hasContent(data.customer.timezone))
    contactFields.push(`<div><strong>Timezone:</strong> ${data.customer.timezone}</div>`)

  if (contactFields.length > 0) {
    const contactInfo = `
      <div style="background: white; border: 1px solid #dee2e6; padding: 16px; margin-bottom: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #495057; display: flex; align-items: center;">
          <span style="margin-right: 8px;">📞</span> Contact Information
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; font-size: 14px;">
          ${contactFields.join("")}
        </div>
        ${hasContent(data.customer.notes) ? `<div style="margin-top: 12px; padding: 8px; background: #e9ecef; border-radius: 4px; font-size: 13px;"><strong>Notes:</strong> ${data.customer.notes}</div>` : ""}
      </div>`
    contentSections.push(contactInfo)
  }

  // Service Address (if available)
  const addressParts = [
    data.address.street,
    data.address.apartment,
    `${data.address.city}, ${data.address.state} ${data.address.zipCode}`,
  ].filter(hasContent)

  if (addressParts.length > 0) {
    const addressInfo = `
      <div style="background: white; border: 1px solid #dee2e6; padding: 16px; margin-bottom: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #495057; display: flex; align-items: center;">
          <span style="margin-right: 8px;">📍</span> Service Address
        </h3>
        <div style="font-size: 14px; line-height: 1.6;">
          ${addressParts.map((part) => `<div style="margin-bottom: 4px;">${part}</div>`).join("")}
          ${hasContent(data.address.addressType) ? `<div style="margin-top: 8px;"><span style="background: #e9ecef; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${data.address.addressType}</span></div>` : ""}
        </div>
        ${hasContent(data.address.accessInstructions) ? `<div style="margin-top: 12px; padding: 10px; background: #fff3cd; border-radius: 6px; font-size: 13px; border-left: 3px solid #ffc107;"><strong>🔑 Access:</strong> ${data.address.accessInstructions}</div>` : ""}
        ${hasContent(data.address.parkingInstructions) ? `<div style="margin-top: 8px; padding: 10px; background: #d1ecf1; border-radius: 6px; font-size: 13px; border-left: 3px solid #17a2b8;"><strong>🚗 Parking:</strong> ${data.address.parkingInstructions}</div>` : ""}
      </div>`
    contentSections.push(addressInfo)
  }

  // Service Details (if available)
  const serviceFields: string[] = []
  if (hasContent(data.serviceDetails.type))
    serviceFields.push(`<div><strong>Type:</strong> ${data.serviceDetails.type}</div>`)
  if (hasContent(data.serviceDetails.frequency))
    serviceFields.push(`<div><strong>Frequency:</strong> ${data.serviceDetails.frequency}</div>`)
  if (hasContent(data.serviceDetails.date))
    serviceFields.push(`<div><strong>Date:</strong> ${new Date(data.serviceDetails.date).toLocaleDateString()}</div>`)
  if (hasContent(data.serviceDetails.time))
    serviceFields.push(`<div><strong>Time:</strong> ${data.serviceDetails.time}</div>`)
  if (hasContent(data.serviceDetails.estimatedDuration))
    serviceFields.push(`<div><strong>Duration:</strong> ${data.serviceDetails.estimatedDuration} min</div>`)

  if (serviceFields.length > 0) {
    const serviceInfo = `
      <div style="background: white; border: 1px solid #dee2e6; padding: 16px; margin-bottom: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #495057; display: flex; align-items: center;">
          <span style="margin-right: 8px;">🧹</span> Service Details
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; font-size: 14px;">
          ${serviceFields.join("")}
        </div>
        ${hasContent(data.serviceDetails.preferences?.join(", ")) ? `<div style="margin-top: 12px; padding: 10px; background: #e7f3ff; border-radius: 6px; font-size: 13px; border-left: 3px solid #007bff;"><strong>⚙️ Preferences:</strong> ${data.serviceDetails.preferences?.join(", ")}</div>` : ""}
        ${hasContent(data.serviceDetails.specialInstructions) ? `<div style="margin-top: 8px; padding: 10px; background: #fff3cd; border-radius: 6px; font-size: 13px; border-left: 3px solid #ffc107;"><strong>📝 Instructions:</strong> ${data.serviceDetails.specialInstructions}</div>` : ""}
      </div>`
    contentSections.push(serviceInfo)
  }

  // Rooms & Add-ons (if available)
  const roomDetails = data.cart.rooms
    ?.map((room) => {
      const customizations = room.customizations?.join(", ")
      return `${room.category}: ${room.count}${customizations ? ` [${customizations}]` : ""}`
    })
    .join(" | ")

  const addonDetails = data.cart.addons
    ?.map((addon) => `${addon.name}: ${addon.quantity}${addon.totalPrice ? ` ($${addon.totalPrice.toFixed(2)})` : ""}`)
    .join(" | ")

  if (hasContent(roomDetails) || hasContent(addonDetails)) {
    const roomsAddons = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        ${
          hasContent(roomDetails)
            ? `
        <div style="background: white; border: 1px solid #dee2e6; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #495057; display: flex; align-items: center;">
            <span style="margin-right: 6px;">🏠</span> Rooms
          </h4>
          <div style="font-size: 13px; color: #6c757d; line-height: 1.4;">${roomDetails}</div>
        </div>`
            : "<div></div>"
        }
        ${
          hasContent(addonDetails)
            ? `
        <div style="background: white; border: 1px solid #dee2e6; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #495057; display: flex; align-items: center;">
            <span style="margin-right: 6px;">✨</span> Add-ons
          </h4>
          <div style="font-size: 13px; color: #6c757d; line-height: 1.4;">${addonDetails}</div>
        </div>`
            : "<div></div>"
        }
      </div>`
    contentSections.push(roomsAddons)
  }

  // Pricing Breakdown (only show non-zero values)
  const pricingRows: string[] = []
  if (Number(data.pricing.subtotal) > 0)
    pricingRows.push(
      `<tr><td style="padding: 6px 0;">Subtotal:</td><td style="padding: 6px 0; text-align: right;">$${Number(data.pricing.subtotal).toFixed(2)}</td></tr>`,
    )
  if (Number(data.pricing.couponDiscount) > 0)
    pricingRows.push(
      `<tr style="color: #28a745;"><td style="padding: 6px 0;">Coupon Discount:</td><td style="padding: 6px 0; text-align: right;">-$${Number(data.pricing.couponDiscount).toFixed(2)}</td></tr>`,
    )
  if (Number(data.pricing.fullHouseDiscount) > 0)
    pricingRows.push(
      `<tr style="color: #28a745;"><td style="padding: 6px 0;">Full House Discount:</td><td style="padding: 6px 0; text-align: right;">-$${Number(data.pricing.fullHouseDiscount).toFixed(2)}</td></tr>`,
    )
  if (Number(data.pricing.taxAmount) > 0)
    pricingRows.push(
      `<tr><td style="padding: 6px 0;">Tax (${data.pricing.taxRate || 8}%):</td><td style="padding: 6px 0; text-align: right;">$${Number(data.pricing.taxAmount).toFixed(2)}</td></tr>`,
    )

  if (pricingRows.length > 0) {
    const pricingInfo = `
      <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 16px; margin-bottom: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #495057; display: flex; align-items: center;">
          <span style="margin-right: 8px;">💰</span> Pricing Breakdown
        </h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          ${pricingRows.join("")}
          <tr style="border-top: 2px solid #dee2e6; font-weight: bold; font-size: 16px;">
            <td style="padding: 12px 0 8px 0;">TOTAL:</td>
            <td style="padding: 12px 0 8px 0; text-align: right; color: ${isUrgent ? "#dc3545" : "#28a745"};">$${Number(data.pricing.totalAmount || 0).toFixed(2)} ${data.pricing.currency || "USD"}</td>
          </tr>
        </table>
        ${hasContent(data.pricing.couponCode) ? `<div style="margin-top: 8px; font-size: 12px; color: #6c757d; text-align: center;">Coupon Applied: <code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px;">${data.pricing.couponCode}</code></div>` : ""}
      </div>`
    contentSections.push(pricingInfo)
  }

  // Payment Info (if available)
  const paymentFields: string[] = []
  if (hasContent(data.payment.method)) paymentFields.push(`<div><strong>Method:</strong> ${data.payment.method}</div>`)
  if (hasContent(data.payment.status)) {
    const statusColor =
      data.payment.status === "completed" ? "#28a745" : data.payment.status === "pending" ? "#ffc107" : "#dc3545"
    paymentFields.push(
      `<div><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold; text-transform: uppercase;">${data.payment.status}</span></div>`,
    )
  }
  if (hasContent(data.payment.transactionId))
    paymentFields.push(
      `<div><strong>Transaction:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${data.payment.transactionId}</code></div>`,
    )
  if (hasContent(data.payment.paymentDate))
    paymentFields.push(`<div><strong>Date:</strong> ${data.payment.paymentDate}</div>`)

  if (paymentFields.length > 0) {
    const paymentInfo = `
      <div style="background: white; border: 1px solid #dee2e6; padding: 16px; margin-bottom: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #495057; display: flex; align-items: center;">
          <span style="margin-right: 8px;">💳</span> Payment Information
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; font-size: 14px;">
          ${paymentFields.join("")}
        </div>
        ${data.payment.allowVideoRecording ? `<div style="margin-top: 10px; padding: 8px; background: #d4edda; border-radius: 6px; color: #155724; font-size: 12px; border-left: 3px solid #28a745;"><strong>✓</strong> Video recording consent provided</div>` : ""}
      </div>`
    contentSections.push(paymentInfo)
  }

  // Create the full HTML email
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmileyBrooms Order ${orderId}</title>
    <style>
        @media only screen and (max-width: 600px) {
            .email-container { margin: 10px !important; }
            .grid-responsive { grid-template-columns: 1fr !important; }
            .mobile-full { width: 100% !important; }
            .mobile-padding { padding: 16px !important; }
            .mobile-text { font-size: 14px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; color: #333; line-height: 1.6;">
    <!-- Container -->
    <div class="email-container" style="max-width: 800px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        
        <!-- Header -->
        <div style="background: ${isUrgent ? "linear-gradient(135deg, #dc3545 0%, #c82333 100%)" : "linear-gradient(135deg, #28a745 0%, #20c997 100%)"}; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                ${isUrgent ? "🔴" : "🧹"} New SmileyBrooms Order
            </h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; font-weight: 500;">
                ${orderId} • ${new Date().toLocaleString()}
            </p>
        </div>
        
        <!-- Content -->
        <div class="mobile-padding" style="padding: 24px;">
            ${contentSections.join("")}
            
            <!-- Next Steps -->
            <div style="background: ${isUrgent ? "#fff5f5" : "#f0f9ff"}; border: 1px solid ${isUrgent ? "#fecaca" : "#bae6fd"}; border-radius: 8px; padding: 16px; margin-top: 20px;">
                <h3 style="margin: 0 0 10px 0; color: ${isUrgent ? "#dc2626" : "#0369a1"}; font-size: 16px; display: flex; align-items: center;">
                    <span style="margin-right: 8px;">${isUrgent ? "⚡" : "🚀"}</span> Next Steps
                </h3>
                <div style="font-size: 14px; color: #374151;">
                    <p style="margin: 0 0 8px 0;"><strong>Response Time:</strong> ${isUrgent ? "Within 2 hours" : "Within 24 hours"}</p>
                    <p style="margin: 0 0 8px 0;"><strong>Contact Method:</strong> ${data.customer.preferredContactMethod || "Phone call"}</p>
                    <p style="margin: 0;"><strong>Questions?</strong> Call (555) 123-4567 or reply to this email</p>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px 24px; border-top: 1px solid #dee2e6; text-align: center;">
            <div style="color: #6c757d; font-size: 14px; margin-bottom: 8px;">
                <strong>SmileyBrooms Professional Cleaning Services</strong>
            </div>
            <div style="color: #6c757d; font-size: 12px;">
                Making your space sparkle, one room at a time! ✨<br>
                📧 orders@smileybrooms.com | 📞 (555) 123-4567<br>
                Order automatically saved to Google Sheets • v3.0.0
            </div>
        </div>
    </div>
</body>
</html>`

  // Generate text content for fallback
  const textContent = generateTextFallback(data, orderId, customerName, isUrgent)

  // Generate subject line
  const subject = `${isUrgent ? "🔴 URGENT - " : ""}New Order ${orderId} - $${Number(data.pricing.totalAmount || 0).toFixed(2)}`

  return { htmlContent, textContent, subject }
}

/**
 * Generate plain text fallback email
 */
function generateTextFallback(data: OrderData, orderId: string, customerName: string, isUrgent: boolean): string {
  const hasContent = (value: any): boolean =>
    value && value !== "" && value !== "0" && value !== "None" && value !== "Not specified"

  let content = `${isUrgent ? "🔴 URGENT - " : ""}NEW ORDER: ${orderId}\n`
  content += `═══════════════════════════════════════\n\n`

  // Essential info
  content += `Customer: ${customerName}\n`
  content += `Total: $${Number(data.pricing.totalAmount || 0).toFixed(2)} ${data.pricing.currency || "USD"}\n`
  content += `Priority: ${data.serviceDetails.urgencyLevel?.toUpperCase() || "MEDIUM"}\n`
  content += `Time: ${new Date().toLocaleString()}\n\n`

  // Contact (only if available)
  if (hasContent(data.customer.email) || hasContent(data.customer.phone)) {
    content += `CONTACT:\n`
    if (hasContent(data.customer.email)) content += `Email: ${data.customer.email}\n`
    if (hasContent(data.customer.phone)) content += `Phone: ${data.customer.phone}\n`
    if (hasContent(data.customer.preferredContactMethod))
      content += `Preferred: ${data.customer.preferredContactMethod}\n`
    content += `\n`
  }

  // Address (only if available)
  const addressParts = [
    data.address.street,
    data.address.apartment,
    `${data.address.city}, ${data.address.state} ${data.address.zipCode}`,
  ].filter(hasContent)
  if (addressParts.length > 0) {
    content += `ADDRESS:\n${addressParts.join("\n")}\n`
    if (hasContent(data.address.accessInstructions)) content += `Access: ${data.address.accessInstructions}\n`
    content += `\n`
  }

  // Service (only if available)
  if (hasContent(data.serviceDetails.type) || hasContent(data.serviceDetails.date)) {
    content += `SERVICE:\n`
    if (hasContent(data.serviceDetails.type)) content += `Type: ${data.serviceDetails.type}\n`
    if (hasContent(data.serviceDetails.frequency)) content += `Frequency: ${data.serviceDetails.frequency}\n`
    if (hasContent(data.serviceDetails.date))
      content += `Date: ${new Date(data.serviceDetails.date).toLocaleDateString()}\n`
    if (hasContent(data.serviceDetails.time)) content += `Time: ${data.serviceDetails.time}\n`
    content += `\n`
  }

  // Payment (only if available)
  if (hasContent(data.payment.method) || hasContent(data.payment.status)) {
    content += `PAYMENT:\n`
    if (hasContent(data.payment.method)) content += `Method: ${data.payment.method}\n`
    if (hasContent(data.payment.status)) content += `Status: ${data.payment.status.toUpperCase()}\n`
    if (hasContent(data.payment.transactionId)) content += `Transaction: ${data.payment.transactionId}\n`
    content += `\n`
  }

  content += `Order saved to Google Sheets automatically.`
  return content
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

  // Generate rich email template for Apps Script
  const emailTemplate = generateBusinessEmailTemplate(data)

  // Enhanced payload that matches your Apps Script exactly
  const enhancedData = {
    ...data,
    emailTemplate, // Your Apps Script checks for this
    systemInfo: {
      version: "3.0.0",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      webhookUrl: WEBHOOK_URL,
      sheetUrl: GOOGLE_SHEET_URL,
    },
  }

  // Debug logging
  if (process.env.NEXT_PUBLIC_EMAIL_DEBUG === "true") {
    console.group("🎨 [Apps Script Debug]")
    console.log("📧 Step:", step)
    console.log("🎯 Email Subject:", emailTemplate.subject)
    console.log("📏 HTML Length:", emailTemplate.htmlContent.length)
    console.log("🎨 Email Priority:", emailTemplate.priority)
    console.log("📦 Full Payload:", JSON.stringify(enhancedData, null, 2))
    console.groupEnd()
  }

  let lastError: any = null
  let fallbackUsed = false

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
          "X-Email-Priority": emailTemplate.priority,
          "X-Email-Category": emailTemplate.category,
        },
        body: JSON.stringify(enhancedData),
      })

      console.log(`🎉 [Apps Script] Data sent successfully for '${step}' (attempt ${attempt})`)

      return {
        success: true,
        message: `Data sent to Apps Script successfully! 📧✨`,
        emailsSent: {
          customer: false, // Apps Script handles this
          business: true,
          team: true,
        },
        retryAttempts: attempt,
        fallbackUsed,
        emailContent: {
          subject: emailTemplate.subject,
          preview: emailTemplate.textContent.substring(0, 150) + "...",
          htmlLength: emailTemplate.htmlContent.length,
        },
      }
    } catch (error) {
      lastError = error
      console.error(`❌ [Apps Script] Attempt ${attempt} failed for '${step}':`, error)

      if (attempt === maxRetries) {
        // Try CORS fallback
        try {
          onProgress?.(attempt, maxRetries, "cors-fallback")
          console.log(`🔄 [Apps Script] Trying CORS fallback for '${step}'`)

          const fallbackResponse = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "SmileyBrooms-Apps-Script-Fallback",
            },
            body: JSON.stringify(enhancedData),
          })

          if (fallbackResponse.ok) {
            const result = await fallbackResponse.json()
            console.log(`🎉 [Apps Script] CORS fallback successful for '${step}'`, result)
            fallbackUsed = true

            return {
              success: true,
              message: "Data sent via fallback method! 📧✨",
              emailsSent: {
                customer: false,
                business: true,
                team: true,
              },
              retryAttempts: attempt + 1,
              fallbackUsed: true,
              emailContent: {
                subject: emailTemplate.subject,
                preview: emailTemplate.textContent.substring(0, 150) + "...",
                htmlLength: emailTemplate.htmlContent.length,
              },
            }
          } else {
            throw new Error(`HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}`)
          }
        } catch (fallbackError) {
          console.error(`❌ [Apps Script] All methods failed for '${step}':`, fallbackError)

          return {
            success: false,
            message: "Unable to send data to Apps Script. Our team has been notified.",
            error: `All delivery methods failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
            retryAttempts: attempt + 1,
            fallbackUsed: false,
            emailContent: {
              subject: emailTemplate.subject,
              preview: "Failed to send",
              htmlLength: emailTemplate.htmlContent.length,
            },
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
    message: "Data delivery failed after all retry attempts.",
    error: `Max retries exceeded: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    retryAttempts: maxRetries,
    fallbackUsed,
    emailContent: {
      subject: emailTemplate.subject,
      preview: "Failed to send",
      htmlLength: emailTemplate.htmlContent.length,
    },
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

  const clientMetadata = getClientMetadata()

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
      internalNotes: `Data sent for step: ${step}`,
      dataSource: "enhanced_checkout_form",
    },
  }

  // Send to Apps Script
  return sendToAppsScript(payload, step, onProgress)
}

// Exported logging functions
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
      screenSize: "large",
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
 * Send order data to Google Apps Script with business email template
 */
export async function logOrderToGoogleSheets(orderData: OrderData): Promise<{ success: boolean; orderId: string }> {
  const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_WEB_APP_URL

  if (!appsScriptUrl) {
    console.error("Google Apps Script URL not configured")
    throw new Error("Google Apps Script URL not configured")
  }

  try {
    // Generate the business email template
    const emailTemplate = generateBusinessEmailTemplate(orderData)

    // Prepare the payload with email template
    const payload = {
      ...orderData,
      emailTemplate: {
        htmlContent: emailTemplate.htmlContent,
        textContent: emailTemplate.textContent,
        subject: emailTemplate.subject,
      },
      timestamp: new Date().toISOString(),
      dataSource: "enhanced_checkout_form",
      emailSystemVersion: "3.0.0",
    }

    console.log("Sending order to Google Sheets with business email template...")

    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      console.log("✅ Order logged successfully:", result.orderId)
      return { success: true, orderId: result.orderId }
    } else {
      console.error("❌ Apps Script returned error:", result.message)
      throw new Error(result.message || "Unknown error from Apps Script")
    }
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
    const response = await fetch(`${appsScriptUrl}?health=check`)
    const result = await response.json()

    console.log("Apps Script Health Check:", result)
    return result.success === true
  } catch (error) {
    console.error("Apps Script health check failed:", error)
    return false
  }
}

// Export types for better TypeScript support
export type { LogEventData, EmailNotificationResult, OrderData }
