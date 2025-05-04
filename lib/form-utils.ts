/**
 * Utility functions for form data processing and enhanced form submissions
 */

// Add emoji prefix based on form type for visual categorization in spreadsheets
export function getFormEmoji(formType: string): string {
  switch (formType.toLowerCase()) {
    case "contact":
      return "📞"
    case "pricing":
      return "💰"
    case "booking":
      return "📅"
    case "waitlist":
      return "⏳"
    case "feedback":
      return "📝"
    default:
      return "📋"
  }
}

// Get common metadata for all form submissions
export function getCommonMetadata() {
  return {
    timestamp: new Date().toISOString(),
    browser: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    page: typeof window !== "undefined" ? window.location.pathname : "/",
    referrer: typeof document !== "undefined" ? document.referrer || "direct" : "unknown",
    device: typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
  }
}

// Create a session ID
export const createSessionId = (): string => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  if (typeof window !== "undefined") {
    sessionStorage.setItem("session_id", sessionId)
  }
  return sessionId
}

// Format US phone number for consistent storage
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "")

  // Check if it's a valid 10-digit US number
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`
  }

  // Return original if not valid format
  return phone
}

// Validate email with common domains
export const validateEmail = (email: string): boolean => {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return false

  // Check against common domains
  const allowedDomains = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "yahoo.com",
    "aol.com",
    "protonmail.com",
    "proton.me",
    "icloud.com",
    "me.com",
    "yandex.com",
    "yandex.ru",
    "comcast.net",
    "verizon.net",
    "cox.net",
    "spectrum.net",
  ]

  const domain = email.split("@")[1].toLowerCase()
  return allowedDomains.includes(domain)
}

// Process form submission with enhanced data
export const processFormSubmission = async (
  scriptURL: string,
  formType: string,
  baseData: Record<string, any>,
  metaData?: Record<string, any>,
  extraData?: Record<string, any>,
): Promise<Response | undefined> => {
  try {
    const emoji = getFormEmoji(formType)
    const commonMeta = getCommonMetadata()

    const formattedPhone = baseData.phone ? formatPhoneNumber(baseData.phone) : undefined

    // Prepare the enhanced data structure
    const enhancedData = {
      ...baseData,
      phone: formattedPhone || baseData.phone,
      message: `${emoji} ${baseData.message || formType.charAt(0).toUpperCase() + formType.slice(1)}`,
      meta: {
        formType,
        ...commonMeta,
        ...metaData,
      },
      data: {
        ...extraData,
      },
    }

    // Submit to Google Sheets
    const response = await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enhancedData),
    })

    return response
  } catch (error) {
    console.error(`Error submitting ${formType} form:`, error)
    throw error
  }
}
