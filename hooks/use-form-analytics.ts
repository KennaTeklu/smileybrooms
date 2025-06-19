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

import { useCallback, useEffect, useRef } from "react"
import {
  initFormTracking,
  trackFormView,
  trackFieldInteraction,
  trackFormSubmission,
  trackFormCompletion,
  trackFormErrors,
  calculateConversionRate,
  trackFormAbandonment,
  getFormMetrics,
} from "../lib/analytics/form-analytics"

export interface UseFormAnalyticsOptions {
  /**
   * Form ID for tracking
   */
  formId: string

  /**
   * Form name for readable tracking
   */
  formName: string

  /**
   * Form type for categorization
   */
  formType?: string

  /**
   * Whether to track field interactions
   */
  trackFields?: boolean

  /**
   * Whether to track form errors
   */
  trackErrors?: boolean

  /**
   * Whether to track form abandonment
   */
  trackAbandonment?: boolean

  /**
   * Custom analytics event handler
   */
  onEvent?: (eventName: string, eventData: any) => void
}

/**
 * Hook for tracking form analytics
 */
export function useFormAnalytics({
  formId,
  formName,
  formType = "standard",
  trackFields = true,
  trackErrors = true,
  trackAbandonment = true,
  onEvent,
}: UseFormAnalyticsOptions) {
  const startTimeRef = useRef<number>(Date.now())
  const interactedFieldsRef = useRef<Set<string>>(new Set())
  const formStateRef = useRef<{
    viewed: boolean
    submitted: boolean
    completed: boolean
    abandoned: boolean
    errors: Record<string, string>
  }>({
    viewed: false,
    submitted: false,
    completed: false,
    abandoned: false,
    errors: {},
  })

  // Initialize tracking
  useEffect(() => {
    initFormTracking(formId)
    startTimeRef.current = Date.now()

    // Track form view
    trackFormView(formId, formName, formType)
    formStateRef.current.viewed = true

    if (onEvent) {
      onEvent("form_view", { formId, formName, formType })
    }

    // Track abandonment on unmount if not completed
    return () => {
      if (
        trackAbandonment &&
        formStateRef.current.viewed &&
        !formStateRef.current.completed &&
        interactedFieldsRef.current.size > 0
      ) {
        const interactionData = {
          formId,
          formName,
          interactedFields: Array.from(interactedFieldsRef.current),
          timeSpent: Date.now() - startTimeRef.current,
        }

        trackFormAbandonment(formId, interactionData)
        formStateRef.current.abandoned = true

        if (onEvent) {
          onEvent("form_abandonment", interactionData)
        }
      }
    }
  }, [formId, formName, formType, trackAbandonment, onEvent])

  // Track field interaction
  const trackField = useCallback(
    (fieldName: string, value: string, interactionType: "change" | "focus" | "blur" = "change") => {
      if (!trackFields) return

      interactedFieldsRef.current.add(fieldName)

      trackFieldInteraction(formId, fieldName, interactionType, {
        fieldName,
        hasValue: value.trim().length > 0,
        interactionType,
      })

      if (onEvent) {
        onEvent("field_interaction", {
          formId,
          formName,
          fieldName,
          interactionType,
          hasValue: value.trim().length > 0,
        })
      }
    },
    [formId, formName, trackFields, onEvent],
  )

  // Track form submission
  const trackSubmission = useCallback(
    (isValid: boolean, values: Record<string, string>) => {
      const submissionData = {
        formId,
        formName,
        isValid,
        fieldCount: Object.keys(values).length,
        filledFieldCount: Object.values(values).filter((v) => v.trim().length > 0).length,
        timeToSubmit: Date.now() - startTimeRef.current,
      }

      trackFormSubmission(formId, submissionData)
      formStateRef.current.submitted = true

      if (onEvent) {
        onEvent("form_submission", submissionData)
      }
    },
    [formId, formName, onEvent],
  )

  // Track form completion
  const trackCompletion = useCallback(
    (success: boolean, values: Record<string, string>) => {
      const completionData = {
        formId,
        formName,
        success,
        fieldCount: Object.keys(values).length,
        filledFieldCount: Object.values(values).filter((v) => v.trim().length > 0).length,
        timeToComplete: Date.now() - startTimeRef.current,
        interactedFields: Array.from(interactedFieldsRef.current),
      }

      trackFormCompletion(formId, completionData)
      formStateRef.current.completed = true

      if (onEvent) {
        onEvent("form_completion", completionData)
      }
    },
    [formId, formName, onEvent],
  )

  // Track form errors
  const trackFormErrorsCallback = useCallback(
    (errors: Record<string, string>) => {
      if (!trackErrors || Object.keys(errors).length === 0) return

      formStateRef.current.errors = errors

      const errorData = {
        formId,
        formName,
        errorCount: Object.keys(errors).length,
        errorFields: Object.keys(errors),
        errors,
      }

      trackFormErrors(formId, errorData)

      if (onEvent) {
        onEvent("form_errors", errorData)
      }
    },
    [formId, formName, trackErrors, onEvent],
  )

  // Get conversion rate
  const getConversionRate = useCallback(() => {
    return calculateConversionRate(formId)
  }, [formId])

  // Get form metrics
  const getMetrics = useCallback(() => {
    return getFormMetrics(formId)
  }, [formId])

  return {
    trackField,
    trackSubmission,
    trackCompletion,
    trackErrors: trackFormErrorsCallback,
    getConversionRate,
    getMetrics,
  }
}
