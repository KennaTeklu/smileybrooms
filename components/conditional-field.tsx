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
