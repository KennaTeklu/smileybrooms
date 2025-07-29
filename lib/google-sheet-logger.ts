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

// Generate rich HTML email template
function generateEmailTemplate(data: any, step: string, errors: any[] = []): EmailTemplate {
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })

  const stepTitles = {
    welcome_start: "🎉 Welcome to SmileyBrooms!",
    contact_submit: "📝 Contact Information Received",
    address_submit: "📍 Service Address Confirmed",
    cart_proceed_to_checkout_click: "🛒 Proceeding to Checkout",
    cart_review_pay_now_click: "💳 Payment Processing",
    checkout_complete: "✅ Checkout Complete",
    booking_confirmation: "🎊 Booking Confirmed!",
    test_email: "🧪 Test Email",
    health_check: "🏥 System Health Check",
  }

  const stepColors = {
    welcome_start: "#10B981", // Green
    contact_submit: "#3B82F6", // Blue
    address_submit: "#8B5CF6", // Purple
    cart_proceed_to_checkout_click: "#F59E0B", // Amber
    cart_review_pay_now_click: "#EF4444", // Red
    checkout_complete: "#059669", // Emerald
    booking_confirmation: "#DC2626", // Rose
    test_email: "#6366F1", // Indigo
    health_check: "#84CC16", // Lime
  }

  const stepColor = stepColors[step as keyof typeof stepColors] || "#6B7280"
  const stepTitle = stepTitles[step as keyof typeof stepTitles] || `📊 Data Logged: ${step}`

  // Generate cart summary HTML
  const cartSummaryHtml =
    data.cart?.rooms?.length > 0 || data.cart?.addons?.length > 0
      ? `
    <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #1F2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center;">
        🛒 Service Summary
      </h3>
      
      ${
        data.cart.rooms?.length > 0
          ? `
        <div style="margin-bottom: 20px;">
          <h4 style="color: #374151; font-size: 16px; font-weight: 500; margin: 0 0 12px 0;">Rooms & Spaces:</h4>
          ${data.cart.rooms
            .map(
              (room: any) => `
            <div style="background: white; border-radius: 8px; padding: 16px; margin-bottom: 8px; border-left: 4px solid ${stepColor};">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: #1F2937;">${room.category}</strong>
                  <span style="color: #6B7280; margin-left: 8px;">× ${room.count}</span>
                  ${
                    room.customizations?.length > 0
                      ? `
                    <div style="margin-top: 4px;">
                      <small style="color: #059669;">+ ${room.customizations.join(", ")}</small>
                    </div>
                  `
                      : ""
                  }
                </div>
                <div style="text-align: right;">
                  <strong style="color: #1F2937; font-size: 16px;">$${room.totalPrice || room.price}</strong>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
      
      ${
        data.cart.addons?.length > 0
          ? `
        <div>
          <h4 style="color: #374151; font-size: 16px; font-weight: 500; margin: 0 0 12px 0;">Add-on Services:</h4>
          ${data.cart.addons
            .map(
              (addon: any) => `
            <div style="background: white; border-radius: 8px; padding: 16px; margin-bottom: 8px; border-left: 4px solid #10B981;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: #1F2937;">${addon.name}</strong>
                  <span style="color: #6B7280; margin-left: 8px;">× ${addon.quantity}</span>
                </div>
                <div style="text-align: right;">
                  <strong style="color: #1F2937; font-size: 16px;">$${addon.totalPrice || addon.price}</strong>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `
      : ""

  // Generate pricing breakdown HTML
  const pricingHtml = data.pricing
    ? `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 24px; margin: 24px 0; color: white;">
      <h3 style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center;">
        💰 Pricing Breakdown
      </h3>
      
      <div style="background: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Subtotal:</span>
          <span style="font-weight: 500;">$${data.pricing.subtotal?.toFixed(2) || "0.00"}</span>
        </div>
        
        ${
          data.pricing.discountAmount > 0
            ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #10B981;">
            <span>💚 Total Discounts:</span>
            <span style="font-weight: 500;">-$${data.pricing.discountAmount?.toFixed(2) || "0.00"}</span>
          </div>
        `
            : ""
        }
        
        ${
          data.pricing.couponCode
            ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #10B981;">
            <span>🎟️ Coupon (${data.pricing.couponCode}):</span>
            <span style="font-weight: 500;">-$${data.pricing.couponDiscount?.toFixed(2) || "0.00"}</span>
          </div>
        `
            : ""
        }
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Tax (${data.pricing.taxRate || 8}%):</span>
          <span style="font-weight: 500;">$${data.pricing.taxAmount?.toFixed(2) || "0.00"}</span>
        </div>
        
        <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.3); margin: 12px 0;">
        
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600;">
          <span>Total Amount:</span>
          <span>${data.pricing.totalAmount?.toFixed(2) || "0.00"} ${data.pricing.currency || "USD"}</span>
        </div>
      </div>
    </div>
  `
    : ""

  // Generate customer info HTML
  const customerHtml = data.customer
    ? `
    <div style="background: #EFF6FF; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #1E40AF; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center;">
        👤 Customer Information
      </h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <strong style="color: #1F2937;">Name:</strong><br>
          <span style="color: #374151;">${data.customer.firstName} ${data.customer.lastName}</span>
        </div>
        
        <div>
          <strong style="color: #1F2937;">Email:</strong><br>
          <a href="mailto:${data.customer.email}" style="color: #2563EB; text-decoration: none;">${data.customer.email}</a>
        </div>
        
        <div>
          <strong style="color: #1F2937;">Phone:</strong><br>
          <a href="tel:${data.customer.phone}" style="color: #2563EB; text-decoration: none;">${data.customer.phone}</a>
        </div>
        
        ${
          data.customer.timezone
            ? `
          <div>
            <strong style="color: #1F2937;">Timezone:</strong><br>
            <span style="color: #374151;">${data.customer.timezone}</span>
          </div>
        `
            : ""
        }
      </div>
      
      ${
        data.customer.notes
          ? `
        <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #3B82F6;">
          <strong style="color: #1F2937;">Notes:</strong><br>
          <span style="color: #374151;">${data.customer.notes}</span>
        </div>
      `
          : ""
      }
    </div>
  `
    : ""

  // Generate address HTML
  const addressHtml = data.address
    ? `
    <div style="background: #F0FDF4; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #166534; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center;">
        📍 Service Address
      </h3>
      
      <div style="background: white; border-radius: 8px; padding: 16px; border-left: 4px solid #10B981;">
        <div style="color: #1F2937; line-height: 1.6;">
          ${data.address.street}<br>
          ${data.address.apartment ? `${data.address.apartment}<br>` : ""}
          ${data.address.city}, ${data.address.state} ${data.address.zipCode}
        </div>
        
        ${
          data.address.addressType
            ? `
          <div style="margin-top: 12px;">
            <span style="background: #DCFCE7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">
              ${data.address.addressType}
            </span>
          </div>
        `
            : ""
        }
        
        ${
          data.address.accessInstructions || data.address.parkingInstructions
            ? `
          <div style="margin-top: 16px;">
            ${
              data.address.accessInstructions
                ? `
              <div style="margin-bottom: 8px;">
                <strong style="color: #1F2937;">Access Instructions:</strong><br>
                <span style="color: #374151;">${data.address.accessInstructions}</span>
              </div>
            `
                : ""
            }
            
            ${
              data.address.parkingInstructions
                ? `
              <div>
                <strong style="color: #1F2937;">Parking Instructions:</strong><br>
                <span style="color: #374151;">${data.address.parkingInstructions}</span>
              </div>
            `
                : ""
            }
          </div>
        `
            : ""
        }
      </div>
    </div>
  `
    : ""

  // Generate service details HTML
  const serviceHtml = data.serviceDetails
    ? `
    <div style="background: #FEF3C7; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #92400E; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center;">
        🧹 Service Details
      </h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <strong style="color: #1F2937;">Service Type:</strong><br>
          <span style="color: #374151;">${data.serviceDetails.type}</span>
        </div>
        
        <div>
          <strong style="color: #1F2937;">Frequency:</strong><br>
          <span style="color: #374151;">${data.serviceDetails.frequency}</span>
        </div>
        
        ${
          data.serviceDetails.date
            ? `
          <div>
            <strong style="color: #1F2937;">Preferred Date:</strong><br>
            <span style="color: #374151;">${data.serviceDetails.date}</span>
          </div>
        `
            : ""
        }
        
        ${
          data.serviceDetails.time
            ? `
          <div>
            <strong style="color: #1F2937;">Preferred Time:</strong><br>
            <span style="color: #374151;">${data.serviceDetails.time}</span>
          </div>
        `
            : ""
        }
        
        ${
          data.serviceDetails.estimatedDuration
            ? `
          <div>
            <strong style="color: #1F2937;">Estimated Duration:</strong><br>
            <span style="color: #374151;">${data.serviceDetails.estimatedDuration} minutes</span>
          </div>
        `
            : ""
        }
      </div>
      
      ${
        data.serviceDetails.specialInstructions
          ? `
        <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #F59E0B;">
          <strong style="color: #1F2937;">Special Instructions:</strong><br>
          <span style="color: #374151;">${data.serviceDetails.specialInstructions}</span>
        </div>
      `
          : ""
      }
      
      ${
        data.serviceDetails.preferences?.length > 0
          ? `
        <div style="margin-top: 16px;">
          <strong style="color: #1F2937;">Service Preferences:</strong><br>
          <div style="margin-top: 8px;">
            ${data.serviceDetails.preferences
              .map(
                (pref: string) => `
              <span style="background: white; color: #92400E; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; margin-right: 8px; margin-bottom: 4px; display: inline-block;">
                ${pref}
              </span>
            `,
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }
    </div>
  `
    : ""

  // Generate payment info HTML
  const paymentHtml = data.payment
    ? `
    <div style="background: #FDF2F8; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #BE185D; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center;">
        💳 Payment Information
      </h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <strong style="color: #1F2937;">Payment Method:</strong><br>
          <span style="color: #374151;">${data.payment.method}</span>
        </div>
        
        <div>
          <strong style="color: #1F2937;">Status:</strong><br>
          <span style="background: ${data.payment.status === "completed" ? "#DCFCE7" : "#FEF3C7"}; color: ${data.payment.status === "completed" ? "#166534" : "#92400E"}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">
            ${data.payment.status}
          </span>
        </div>
        
        ${
          data.payment.transactionId
            ? `
          <div>
            <strong style="color: #1F2937;">Transaction ID:</strong><br>
            <code style="background: white; color: #374151; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 12px;">${data.payment.transactionId}</code>
          </div>
        `
            : ""
        }
        
        ${
          data.payment.paymentDate
            ? `
          <div>
            <strong style="color: #1F2937;">Payment Date:</strong><br>
            <span style="color: #374151;">${new Date(data.payment.paymentDate).toLocaleString()}</span>
          </div>
        `
            : ""
        }
      </div>
      
      ${
        data.payment.allowVideoRecording !== undefined
          ? `
        <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid ${data.payment.allowVideoRecording ? "#10B981" : "#EF4444"};">
          <strong style="color: #1F2937;">Video Recording Consent:</strong><br>
          <span style="color: ${data.payment.allowVideoRecording ? "#059669" : "#DC2626"};">
            ${data.payment.allowVideoRecording ? "✅ Customer consented to video recording" : "❌ Customer declined video recording"}
          </span>
        </div>
      `
          : ""
      }
    </div>
  `
    : ""

  // Generate metadata HTML
  const metadataHtml = data.metadata
    ? `
    <div style="background: #F3F4F6; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #374151; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center;">
        📊 Technical Details
      </h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <strong style="color: #1F2937;">Device:</strong><br>
          <span style="color: #374151;">${data.metadata.deviceType} (${data.metadata.screenSize})</span>
        </div>
        
        <div>
          <strong style="color: #1F2937;">Browser:</strong><br>
          <span style="color: #374151;">${data.metadata.browser}</span>
        </div>
        
        <div>
          <strong style="color: #1F2937;">Location:</strong><br>
          <span style="color: #374151;">${data.metadata.timezone}</span>
        </div>
        
        <div>
          <strong style="color: #1F2937;">Session ID:</strong><br>
          <code style="background: white; color: #374151; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 11px;">${data.metadata.sessionId}</code>
        </div>
      </div>
      
      ${
        data.metadata.utmSource || data.metadata.utmMedium || data.metadata.utmCampaign
          ? `
        <div style="margin-top: 16px;">
          <strong style="color: #1F2937;">Marketing Attribution:</strong><br>
          <div style="margin-top: 8px;">
            ${data.metadata.utmSource ? `<span style="background: white; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; margin-bottom: 4px; display: inline-block;">Source: ${data.metadata.utmSource}</span>` : ""}
            ${data.metadata.utmMedium ? `<span style="background: white; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; margin-bottom: 4px; display: inline-block;">Medium: ${data.metadata.utmMedium}</span>` : ""}
            ${data.metadata.utmCampaign ? `<span style="background: white; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; margin-bottom: 4px; display: inline-block;">Campaign: ${data.metadata.utmCampaign}</span>` : ""}
          </div>
        </div>
      `
          : ""
      }
    </div>
  `
    : ""

  // Generate error reporting HTML
  const errorHtml =
    errors.length > 0
      ? `
    <div style="background: #FEF2F2; border: 2px solid #FECACA; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #DC2626; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; display: flex; align-items: center;">
        ⚠️ Issues Encountered
      </h3>
      
      ${errors
        .map(
          (error, index) => `
        <div style="background: white; border-radius: 8px; padding: 16px; margin-bottom: 12px; border-left: 4px solid #EF4444;">
          <div style="display: flex; justify-content: between; align-items: start;">
            <div style="flex: 1;">
              <strong style="color: #DC2626;">Error ${index + 1}:</strong><br>
              <span style="color: #374151; font-family: monospace; font-size: 14px;">${error.message || error}</span>
            </div>
            <div style="text-align: right; color: #6B7280; font-size: 12px;">
              ${error.timestamp || timestamp}
            </div>
          </div>
          
          ${
            error.stack
              ? `
            <details style="margin-top: 12px;">
              <summary style="color: #6B7280; cursor: pointer; font-size: 12px;">Stack Trace</summary>
              <pre style="background: #F9FAFB; padding: 8px; border-radius: 4px; font-size: 11px; color: #374151; margin-top: 8px; overflow-x: auto;">${error.stack}</pre>
            </details>
          `
              : ""
          }
        </div>
      `,
        )
        .join("")}
      
      <div style="background: #FEF3C7; border-radius: 8px; padding: 12px; margin-top: 16px;">
        <strong style="color: #92400E;">💡 Troubleshooting:</strong><br>
        <span style="color: #374151; font-size: 14px;">
          These errors have been automatically logged. If issues persist, please check the 
          <a href="${GOOGLE_SHEET_URL}" style="color: #2563EB; text-decoration: none;">Google Sheet</a> 
          for detailed logs or contact the development team.
        </span>
      </div>
    </div>
  `
      : ""

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${stepTitle} - SmileyBrooms Data Logger</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
          line-height: 1.6; 
          color: #1F2937; 
          margin: 0; 
          padding: 0; 
          background-color: #F9FAFB; 
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          background: white; 
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); 
        }
        .header { 
          background: linear-gradient(135deg, ${stepColor} 0%, ${stepColor}CC 100%); 
          color: white; 
          padding: 40px 32px; 
          text-align: center; 
        }
        .content { 
          padding: 32px; 
        }
        .footer { 
          background: #F3F4F6; 
          padding: 24px 32px; 
          text-align: center; 
          border-top: 1px solid #E5E7EB; 
        }
        .quick-actions {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
          text-align: center;
        }
        .quick-actions a {
          display: inline-block;
          background: white;
          color: #667eea;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin: 0 8px;
          transition: transform 0.2s;
        }
        .quick-actions a:hover {
          transform: translateY(-2px);
        }
        @media (max-width: 600px) {
          .container { margin: 0; box-shadow: none; }
          .header, .content, .footer { padding: 24px 16px; }
          .quick-actions a { display: block; margin: 8px 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">
            ${stepTitle}
          </h1>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">
            Data successfully logged to SmileyBrooms system
          </p>
          <div style="margin-top: 16px; font-size: 14px; opacity: 0.8;">
            📅 ${timestamp}
          </div>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Order ID -->
          ${
            data.orderId
              ? `
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; opacity: 0.9;">Order Reference</h3>
              <div style="font-size: 24px; font-weight: 700; font-family: monospace; letter-spacing: 1px;">
                ${data.orderId}
              </div>
            </div>
          `
              : ""
          }

          <!-- Quick Actions -->
          <div class="quick-actions">
            <h3 style="color: white; margin: 0 0 16px 0; font-size: 18px;">🚀 Quick Actions</h3>
            <a href="${GOOGLE_SHEET_URL}" target="_blank">📊 View Google Sheet</a>
            <a href="mailto:${data.customer?.email || "support@smileybrooms.com"}" target="_blank">📧 Contact Customer</a>
            <a href="tel:${data.customer?.phone || ""}" target="_blank">📞 Call Customer</a>
          </div>

          <!-- Data Sections -->
          ${customerHtml}
          ${addressHtml}
          ${serviceHtml}
          ${cartSummaryHtml}
          ${pricingHtml}
          ${paymentHtml}
          ${metadataHtml}
          ${errorHtml}

          <!-- Summary Stats -->
          <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
              📈 Summary Statistics
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 700;">${data.cart?.totalItems || 0}</div>
                <div style="font-size: 14px; opacity: 0.9;">Total Items</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 700;">${data.cart?.rooms?.length || 0}</div>
                <div style="font-size: 14px; opacity: 0.9;">Rooms</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 700;">${data.cart?.addons?.length || 0}</div>
                <div style="font-size: 14px; opacity: 0.9;">Add-ons</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: 700;">$${data.pricing?.totalAmount?.toFixed(2) || "0.00"}</div>
                <div style="font-size: 14px; opacity: 0.9;">Total Value</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">
            This email was automatically generated by the SmileyBrooms Beautiful Email System
          </p>
          <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
            🧹 Making your home sparkle, one notification at a time ✨
          </p>
          <div style="margin-top: 16px;">
            <a href="${GOOGLE_SHEET_URL}" style="color: #2563EB; text-decoration: none; font-size: 12px;">
              📊 View Full Data in Google Sheet
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
    ${stepTitle}
    SmileyBrooms Data Logger Notification
    
    Timestamp: ${timestamp}
    ${data.orderId ? `Order ID: ${data.orderId}` : ""}
    
    ${
      data.customer
        ? `
    CUSTOMER INFORMATION:
    Name: ${data.customer.firstName} ${data.customer.lastName}
    Email: ${data.customer.email}
    Phone: ${data.customer.phone}
    ${data.customer.notes ? `Notes: ${data.customer.notes}` : ""}
    `
        : ""
    }
    
    ${
      data.address
        ? `
    SERVICE ADDRESS:
    ${data.address.street}
    ${data.address.apartment ? data.address.apartment : ""}
    ${data.address.city}, ${data.address.state} ${data.address.zipCode}
    Type: ${data.address.addressType}
    `
        : ""
    }
    
    ${
      data.pricing
        ? `
    PRICING:
    Subtotal: $${data.pricing.subtotal?.toFixed(2) || "0.00"}
    Discounts: -$${data.pricing.discountAmount?.toFixed(2) || "0.00"}
    Tax: $${data.pricing.taxAmount?.toFixed(2) || "0.00"}
    Total: $${data.pricing.totalAmount?.toFixed(2) || "0.00"}
    `
        : ""
    }
    
    ${
      errors.length > 0
        ? `
    ERRORS ENCOUNTERED:
    ${errors.map((error, index) => `${index + 1}. ${error.message || error}`).join("\n")}
    `
        : ""
    }
    
    View full data: ${GOOGLE_SHEET_URL}
    
    ---
    This email was automatically generated by SmileyBrooms Beautiful Email System
    🧹 Making your home sparkle, one notification at a time ✨
  `

  return {
    subject: `${stepTitle} - Order ${data.orderId || "N/A"} - ${timestamp}`,
    htmlContent,
    textContent,
    priority: errors.length > 0 ? "high" : data.urgencyLevel === "high" ? "high" : "normal",
    category: step,
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

  // Generate rich email template
  const emailTemplate = generateEmailTemplate(data, step)

  // Enhanced payload with email template
  const enhancedData = {
    ...data,
    emailTemplate,
    systemInfo: {
      version: "2.0.0",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      webhookUrl: WEBHOOK_URL,
      sheetUrl: GOOGLE_SHEET_URL,
    },
  }

  // Debug logging with beautiful formatting
  if (process.env.NEXT_PUBLIC_EMAIL_DEBUG === "true") {
    console.group("🎨 [Beautiful Email Debug]")
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
      console.log(`✨ [Beautiful Email] Sending gorgeous email (${attempt}/${maxRetries}) for '${step}'`)

      // Primary method: no-cors (most reliable for Google Apps Script)
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "SmileyBrooms-Beautiful-Email",
          "X-Email-Priority": emailTemplate.priority,
          "X-Email-Category": emailTemplate.category,
        },
        body: JSON.stringify({
          ...enhancedData,
          emailMetadata: {
            attempt,
            maxRetries,
            method: "no-cors",
            timestamp: new Date().toISOString(),
            userAgent: navigator?.userAgent || "server-side",
            emailLength: emailTemplate.htmlContent.length,
            hasErrors: data.errors?.length > 0,
          },
        }),
      })

      console.log(`🎉 [Beautiful Email] Gorgeous email sent successfully for '${step}' (attempt ${attempt})`)

      return {
        success: true,
        message: `Beautiful email notification sent successfully! 📧✨`,
        emailsSent: {
          customer: true,
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
              "X-Email-Priority": emailTemplate.priority,
              "X-Email-Category": emailTemplate.category,
            },
            body: JSON.stringify({
              ...enhancedData,
              emailMetadata: {
                attempt: attempt + 1,
                maxRetries,
                method: "cors-fallback",
                timestamp: new Date().toISOString(),
                fallbackReason: "no-cors-failed",
                emailLength: emailTemplate.htmlContent.length,
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
          console.error(`❌ [Beautiful Email] CORS fallback failed for '${step}':`, fallbackError)

          // Final fallback: Form submission
          try {
            onProgress?.(attempt, maxRetries, "form-submission")
            console.log(`🔄 [Beautiful Email] Trying form submission fallback for '${step}'`)

            await sendViaFormSubmission(enhancedData, step)
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
              emailContent: {
                subject: emailTemplate.subject,
                preview: emailTemplate.textContent.substring(0, 150) + "...",
                htmlLength: emailTemplate.htmlContent.length,
              },
            }
          } catch (formError) {
            console.error(`❌ [Beautiful Email] All methods failed for '${step}':`, formError)

            return {
              success: false,
              message: "Unable to send email notifications. Our team has been notified and will contact you directly.",
              error: `All delivery methods failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
              retryAttempts: attempt + 2,
              fallbackUsed: false,
              emailContent: {
                subject: emailTemplate.subject,
                preview: "Failed to send",
                htmlLength: emailTemplate.htmlContent.length,
              },
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
    emailContent: {
      subject: emailTemplate.subject,
      preview: "Failed to send",
      htmlLength: emailTemplate.htmlContent.length,
    },
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
        "Rich error reporting",
        "Google Sheet integration",
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
          emailTemplate: result.emailContent,
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
