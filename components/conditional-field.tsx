"use client"

import type React from "react"
import { useDynamicForm } from "@/hooks/use-dynamic-form" // Assuming this hook exists

interface ConditionalFieldProps {
  name: string // The name of the field this component represents
  condition: (formData: Record<string, any>) => boolean // Function to determine visibility
  children: React.ReactNode
}

/**
 * A component that conditionally renders its children based on a form data condition.
 * It expects to be used within a form context that provides form data.
 */
export default function ConditionalField({ name, condition, children }: ConditionalFieldProps) {
  const { formData } = useDynamicForm() // Get form data from context

  const isVisible = condition(formData)

  // You might want to handle the case where the field is hidden but still part of the form state.
  // For simplicity, this component only controls visibility.
  // If you need to clear values when hidden, that logic would be in useDynamicForm or a parent.

  return isVisible ? <div data-field-name={name}>{children}</div> : null
}
