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

/**
 * Honeypot Field Utilities
 *
 * This module provides utilities for implementing honeypot fields in forms
 * to detect and prevent automated spam submissions.
 */

import { useState, useEffect } from "react"
import { generateRandomToken } from "./csrf"
import type React from "react"

// Interface for honeypot field options
export interface HoneypotOptions {
  fieldName?: string
  cssClass?: string
  validationMessage?: string
  enableTimingCheck?: boolean
  minSubmitTime?: number // Minimum time in ms before submission is considered valid
}

// Default options
const DEFAULT_OPTIONS: HoneypotOptions = {
  fieldName: "website_url",
  cssClass: "hidden-field",
  validationMessage: "Form submission failed validation",
  enableTimingCheck: true,
  minSubmitTime: 3000, // 3 seconds
}

/**
 * Generate a random field name for the honeypot
 * This makes it harder for bots to identify the honeypot field
 * @returns A random field name
 */
export function generateHoneypotFieldName(): string {
  const commonFieldNames = [
    "website",
    "url",
    "email2",
    "phone2",
    "address2",
    "comment",
    "notes",
    "additional",
    "extra",
    "more",
  ]

  const randomIndex = Math.floor(Math.random() * commonFieldNames.length)
  const randomSuffix = generateRandomToken().substring(0, 6)

  return `${commonFieldNames[randomIndex]}_${randomSuffix}`
}

/**
 * Create CSS for hiding the honeypot field
 * @param className - The CSS class name to use
 * @returns CSS string for hiding the field
 */
export function createHoneypotCSS(className: string): string {
  return `
    .${className} {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      height: 0;
      width: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
    }
  `
}

/**
 * Validate a honeypot field
 * @param value - The value of the honeypot field
 * @returns Whether the submission is valid (true if honeypot is empty)
 */
export function validateHoneypot(value: string | undefined | null): boolean {
  // If the field has a value, it was likely filled by a bot
  return !value || value.trim() === ""
}

/**
 * Validate submission timing
 * @param startTime - The time when the form was rendered
 * @param minTime - Minimum time in ms before submission is considered valid
 * @returns Whether the submission timing is valid
 */
export function validateSubmissionTiming(startTime: number, minTime: number): boolean {
  const submissionTime = Date.now() - startTime
  // If submitted too quickly, likely a bot
  return submissionTime >= minTime
}

/**
 * React hook for honeypot fields
 * @param options - Honeypot configuration options
 * @returns Object with honeypot field props and validation function
 */
export function useHoneypot(options: Partial<HoneypotOptions> = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const fieldName = opts.fieldName || generateHoneypotFieldName()
  const [startTime] = useState<number>(Date.now())

  // Add the honeypot CSS to the document
  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleId = "honeypot-styles"
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style")
        style.id = styleId
        style.innerHTML = createHoneypotCSS(opts.cssClass || DEFAULT_OPTIONS.cssClass!)
        document.head.appendChild(style)
      }
    }
  }, [opts.cssClass])

  // Validation function
  const validateSubmission = (formData: FormData): boolean => {
    // Check honeypot field
    const honeypotValue = formData.get(fieldName) as string | null
    const isHoneypotValid = validateHoneypot(honeypotValue)

    // Check timing if enabled
    let isTimingValid = true
    if (opts.enableTimingCheck) {
      isTimingValid = validateSubmissionTiming(startTime, opts.minSubmitTime || DEFAULT_OPTIONS.minSubmitTime!)
    }

    return isHoneypotValid && isTimingValid
  }

  // Honeypot field JSX
  const honeypotField = (
    <div className={opts.cssClass}>
      <label htmlFor={fieldName}>Please leave this field empty</label>
      <input type="text" id={fieldName} name={fieldName} tabIndex={-1} autoComplete="off" />
    </div>
  )

  return {
    fieldName,
    honeypotField,
    validateSubmission,
    startTime,
  }
}

/**
 * Create a server-side honeypot validator
 * This can be used in server actions or API routes
 * @param options - Honeypot configuration options
 * @returns A function to validate form data
 */
export function createHoneypotValidator(options: Partial<HoneypotOptions> = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  return function validateHoneypotSubmission(formData: FormData): {
    valid: boolean
    message?: string
  } {
    const honeypotValue = formData.get(opts.fieldName || DEFAULT_OPTIONS.fieldName!) as string | null
    const isValid = validateHoneypot(honeypotValue)

    return {
      valid: isValid,
      message: isValid ? undefined : opts.validationMessage,
    }
  }
}

/**
 * Add multiple honeypot fields to a form
 * This makes it even harder for bots to identify all honeypot fields
 * @param count - Number of honeypot fields to create
 * @param options - Honeypot configuration options
 * @returns Array of honeypot fields and a validation function
 */
export function createMultipleHoneypots(count: number, options: Partial<HoneypotOptions> = {}) {
  const fieldNames: string[] = []
  const honeypotFields: React.ReactNode[] = []

  for (let i = 0; i < count; i++) {
    const fieldName = generateHoneypotFieldName()
    fieldNames.push(fieldName)

    honeypotFields.push(
      <div key={fieldName} className={options.cssClass || DEFAULT_OPTIONS.cssClass}>
        <label htmlFor={fieldName}>Please leave this field empty</label>
        <input type="text" id={fieldName} name={fieldName} tabIndex={-1} autoComplete="off" />
      </div>,
    )
  }

  // Validation function for multiple honeypots
  const validateSubmission = (formData: FormData): boolean => {
    return fieldNames.every((name) => {
      const value = formData.get(name) as string | null
      return validateHoneypot(value)
    })
  }

  return {
    fieldNames,
    honeypotFields,
    validateSubmission,
  }
}
