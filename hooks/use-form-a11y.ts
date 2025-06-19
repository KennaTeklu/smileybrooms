"use client"
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

import { useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  generateAriaDescriptions,
  generateFieldIds,
  announceFormErrors as announceFormErrorsUtil,
  createFocusManager,
  getErrorSummary,
} from "../lib/accessibility/form-a11y"

export interface UseFormA11yOptions {
  /**
   * Form ID for associating ARIA attributes
   */
  formId: string

  /**
   * Whether to announce errors automatically
   */
  announceErrors?: boolean

  /**
   * Whether to focus the first error field automatically
   */
  focusOnError?: boolean

  /**
   * Whether to manage focus when navigating between form steps
   */
  manageFocus?: boolean

  /**
   * Whether to scroll to errors automatically
   */
  scrollToErrors?: boolean

  /**
   * Custom error announcement function
   */
  customAnnouncer?: (message: string) => void
}

/**
 * Hook for enhancing form accessibility
 */
export function useFormA11y({
  formId,
  announceErrors = true,
  focusOnError = true,
  manageFocus = true,
  scrollToErrors = true,
  customAnnouncer,
}: UseFormA11yOptions) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const announcerRef = useRef<HTMLDivElement>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const errorsRef = useRef<Record<string, string>>({})

  // Generate consistent IDs for form fields
  const getFieldIds = useCallback(
    (fieldName: string) => {
      return generateFieldIds(formId, fieldName)
    },
    [formId],
  )

  // Generate ARIA description IDs
  const getAriaDescriptions = useCallback(
    (fieldName: string, hasError: boolean, hasHint: boolean) => {
      return generateAriaDescriptions(formId, fieldName, hasError, hasHint)
    },
    [formId],
  )

  // Focus management
  const focusManager = useCallback(() => {
    if (!formRef.current) return null
    return createFocusManager(formRef.current)
  }, [])

  // Focus first error
  const focusFirstError = useCallback(() => {
    if (!formRef.current || !focusOnError) return

    const firstErrorField = formRef.current.querySelector("[aria-invalid='true']") as HTMLElement
    if (firstErrorField) {
      firstErrorField.focus()
      if (scrollToErrors) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [focusOnError, scrollToErrors])

  // Announce errors
  const announceErrorsFn = useCallback(
    (errors: Record<string, string>) => {
      if (!announceErrors || Object.keys(errors).length === 0) return

      const errorSummary = getErrorSummary(errors)
      if (customAnnouncer) {
        customAnnouncer(errorSummary)
      } else if (announcerRef.current) {
        announceFormErrorsUtil(announcerRef.current, errorSummary)
      }
    },
    [announceErrors, customAnnouncer],
  )

  // Handle errors
  const handleErrors = useCallback(
    (errors: Record<string, string>) => {
      errorsRef.current = errors

      if (Object.keys(errors).length > 0) {
        announceErrorsFn(errors)
        focusFirstError()
      }
    },
    [announceErrorsFn, focusFirstError],
  )

  // Save last focused element before navigation
  useEffect(() => {
    if (!manageFocus) return

    const handleRouteChangeStart = () => {
      lastFocusedElementRef.current = document.activeElement as HTMLElement
    }

    // Listen for route changes
    router.events?.on?.("routeChangeStart", handleRouteChangeStart)

    return () => {
      router.events?.off?.("routeChangeStart", handleRouteChangeStart)
    }
  }, [router, manageFocus])

  // Restore focus after navigation
  useEffect(() => {
    if (!manageFocus || !lastFocusedElementRef.current) return

    // Focus the previously focused element if it exists in the new page
    const lastFocusedId = lastFocusedElementRef.current.id
    if (lastFocusedId) {
      const element = document.getElementById(lastFocusedId)
      if (element) {
        element.focus()
      }
    }
  }, [manageFocus])

  return {
    formRef,
    announcerRef,
    getFieldIds,
    getAriaDescriptions,
    focusManager,
    handleErrors,
    announceErrors: announceErrorsFn,
    focusFirstError,
  }
}
