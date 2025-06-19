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
/* Don't modify beyond what is requested ever. */
"use client"

import type React from "react"

interface ConditionalFieldProps {
  /**
   * Whether the field should be visible
   */
  isVisible: boolean

  /**
   * Whether to keep the field in the DOM when hidden
   * @default false
   */
  keepInDom?: boolean

  /**
   * Children to render when the field is visible
   */
  children: React.ReactNode
}

/**
 * Component for conditionally rendering form fields
 */
export function ConditionalField({ isVisible, keepInDom = false, children }: ConditionalFieldProps) {
  if (!isVisible && !keepInDom) {
    return null
  }

  return (
    <div className={isVisible ? "" : "hidden"} aria-hidden={!isVisible}>
      {children}
    </div>
  )
}
