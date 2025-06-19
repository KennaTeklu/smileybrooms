/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
/**
 * Form Security Module
 *
 * This module exports all security-related utilities for forms in one place.
 */

// Export CSRF protection utilities
export * from "./csrf"

// Export rate limiting utilities
export * from "./rate-limit"

// Export honeypot utilities
export * from "./honeypot"
import { useCSRFProtection } from "./csrf"
import { useRateLimit } from "./rate-limit"
import { useHoneypot } from "./honeypot"

export interface FormSecurityOptions {
  formId: string
  userId?: string
  action?: string
  csrfMaxAge?: number
  rateLimitOptions?: {
    maxAttempts?: number
    windowMs?: number
    blockDurationMs?: number
  }
  honeypotOptions?: {
    fieldName?: string
    cssClass?: string
    enableTimingCheck?: boolean
    minSubmitTime?: number
  }
}

export function useFormSecurity({
  formId,
  userId = "anonymous",
  action = "form-submission",
  csrfMaxAge,
  rateLimitOptions,
  honeypotOptions,
}: FormSecurityOptions) {
  // Initialize CSRF protection
  const csrf = useCSRFProtection(formId, csrfMaxAge)

  // Initialize rate limiting
  const rateLimit = useRateLimit(userId, action, rateLimitOptions)

  // Initialize honeypot
  const honeypot = useHoneypot(honeypotOptions)

  // Combined validation function
  const validateSecurity = (
    formData: FormData,
  ): {
    valid: boolean
    errors: string[]
  } => {
    const errors: string[] = []

    // Check CSRF token
    const submittedToken = formData.get("csrf_token") as string
    if (!csrf.validateToken(submittedToken)) {
      errors.push("Invalid or expired security token")
    }

    // Check rate limit
    if (rateLimit.limited) {
      const resetTime = new Date(rateLimit.resetTime || 0).toLocaleTimeString()
      errors.push(`Too many attempts. Please try again after ${resetTime}`)
    }

    // Check honeypot
    if (!honeypot.validateSubmission(formData)) {
      errors.push("Form submission failed validation")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // Record a submission attempt
  const recordSubmission = () => {
    return rateLimit.recordAction()
  }

  return {
    csrf,
    rateLimit,
    honeypot,
    validateSecurity,
    recordSubmission,
    securityFields: (
      <>
        {csrf.csrfField}
        {honeypot.honeypotField}
      </>
    ),
  }
}
