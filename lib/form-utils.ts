/**
 * Form Utilities Module
 *
 * This module provides comprehensive utilities for form handling, data processing, and submission
 * throughout the application. It standardizes form interactions, adds metadata to submissions,
 * and ensures consistent data formatting.
 *
 * Key functionalities:
 * - Form type categorization with emoji prefixes
 * - Metadata collection for analytics
 * - Session tracking
 * - Data formatting (phone numbers, etc.)
 * - Form validation
 * - Enhanced form submission with error handling
 *
 * Potential improvements (100):
 * 1. Add TypeScript interfaces for all function parameters and return types
 * 2. Implement more robust email validation with regex patterns for specific domains
 * 3. Add phone number validation for international formats
 * 4. Create address validation utilities
 * 5. Add ZIP/postal code validation for international formats
 * 6. Implement form state management hooks
 * 7. Add form field masking utilities
 * 8. Create utilities for handling file uploads
 * 9. Add CSRF protection utilities
 * 10. Implement rate limiting for form submissions
 * 11. Add honeypot fields for spam prevention
 * 12. Create utilities for multi-step forms
 * 13. Add form progress tracking
 * 14. Implement form autosave functionality
 * 15. Add utilities for form field dependencies
 * 16. Create conditional form field utilities
 * 17. Add form accessibility helpers
 * 18. Implement form analytics tracking
 * 19. Add form conversion rate utilities
 * 20. Create form A/B testing utilities
 * 21. Add form localization utilities
 * 22. Implement form field encryption for sensitive data
 * 23. Add utilities for handling form arrays/lists
 * 24. Create dynamic form generation utilities
 * 25. Add form schema validation
 * 26. Implement form data persistence across sessions
 * 27. Add form data export utilities (CSV, PDF)
 * 28. Create form data import utilities
 * 29. Add utilities for form field suggestions
 * 30. Implement form field autocomplete
 * 31. Add utilities for handling form errors
 * 32. Create form submission retry logic
 * 33. Add offline form submission capabilities
 * 34. Implement form data synchronization
 * 35. Add form field dependency validation
 * 36. Create utilities for conditional validation rules
 * 37. Add form field transformation utilities
 * 38. Implement form data normalization
 * 39. Add utilities for handling form redirects
 * 40. Create form success/error message utilities
 * 41. Add form analytics event tracking
 * 42. Implement form abandonment tracking
 * 43. Add utilities for form field focus tracking
 * 44. Create form completion time utilities
 * 45. Add form field interaction heatmap data collection
 * 46. Implement form field value history tracking
 * 47. Add utilities for form field default values
 * 48. Create form reset utilities
 * 49. Add form validation summary utilities
 * 50. Implement form field grouping utilities
 * 51. Add utilities for handling form sections
 * 52. Create form field visibility toggle utilities
 * 53. Add form field conditional rendering
 * 54. Implement form field dependency chains
 * 55. Add utilities for form field calculations
 * 56. Create form total calculation utilities
 * 57. Add tax calculation utilities
 * 58. Implement discount calculation utilities
 * 59. Add shipping calculation utilities
 * 60. Create payment method validation utilities
 * 61. Add credit card validation utilities
 * 62. Implement bank account validation utilities
 * 63. Add cryptocurrency payment validation
 * 64. Create digital wallet integration utilities
 * 65. Add subscription management utilities
 * 66. Implement recurring payment utilities
 * 67. Add trial period management utilities
 * 68. Create promo code validation utilities
 * 69. Add gift card validation utilities
 * 70. Implement loyalty points integration
 * 71. Add referral code validation utilities
 * 72. Create user authentication integration
 * 73. Add social login integration utilities
 * 74. Implement two-factor authentication for sensitive forms
 * 75. Add password strength validation utilities
 * 76. Create password confirmation utilities
 * 77. Add username availability checking utilities
 * 78. Implement email verification utilities
 * 79. Add phone verification utilities
 * 80. Create address verification utilities
 * 81. Add geolocation validation utilities
 * 82. Implement IP address validation
 * 83. Add browser fingerprinting for fraud prevention
 * 84. Create bot detection utilities
 * 85. Add form abuse prevention utilities
 * 86. Implement data retention policy utilities
 * 87. Add GDPR compliance utilities
 * 88. Create CCPA compliance utilities
 * 89. Add data deletion request utilities
 * 90. Implement privacy policy acceptance tracking
 * 91. Add terms of service acceptance tracking
 * 92. Create cookie consent utilities
 * 93. Add marketing preferences utilities
 * 94. Implement notification preferences utilities
 * 95. Add form field tooltips and help text utilities
 * 96. Create form field error message customization
 * 97. Add form submission confirmation utilities
 * 98. Implement form data backup utilities
 * 99. Add form version tracking utilities
 * 100. Create form performance optimization utilities
 */

// Add emoji prefix based on form type for visual categorization in spreadsheets
export const getFormEmoji = (formType: string): string => {
  switch (formType) {
    case "waitlist":
      return "🟢"
    case "contact":
      return "🔵"
    case "career":
      return "🟡"
    case "address":
      return "🟣"
    case "checkout":
      return "🔴"
    case "question":
      return "❓"
    default:
      return "⚪"
  }
}

// Get common metadata for all form submissions
export const getCommonMetadata = () => {
  if (typeof window === "undefined") return {}

  return {
    submitDate: new Date().toISOString(),
    browser: navigator.userAgent,
    page: window.location.pathname,
    referrer: document.referrer || "direct",
    device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
    sessionId: sessionStorage.getItem("session_id") || createSessionId(),
    language: navigator.language,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
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
