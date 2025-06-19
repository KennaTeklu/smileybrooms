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

import type React from "react"

import { useState, useCallback } from "react"

export interface UseFieldOptions {
  initialValue?: string
  validators?: Array<(value: string, formValues?: Record<string, any>) => string | undefined>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  onChange?: (value: string) => void
  onBlur?: (value: string) => void
}

export function useField({
  initialValue = "",
  validators = [],
  validateOnChange = true,
  validateOnBlur = true,
  onChange,
  onBlur,
}: UseFieldOptions = {}) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | undefined>(undefined)
  const [touched, setTouched] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Validate the field
  const validate = useCallback(
    (fieldValue: string) => {
      if (validators.length === 0) return undefined

      for (const validator of validators) {
        const validationError = validator(fieldValue)
        if (validationError) return validationError
      }

      return undefined
    },
    [validators],
  )

  // Handle value change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string) => {
      const newValue = typeof e === "string" ? e : e.target.value

      setValue(newValue)
      setIsDirty(true)

      if (validateOnChange) {
        const validationError = validate(newValue)
        setError(validationError)
      }

      if (onChange) onChange(newValue)
    },
    [onChange, validate, validateOnChange],
  )

  // Handle blur
  const handleBlur = useCallback(() => {
    setTouched(true)

    if (validateOnBlur) {
      const validationError = validate(value)
      setError(validationError)
    }

    if (onBlur) onBlur(value)
  }, [onBlur, validate, validateOnBlur, value])

  // Reset the field
  const reset = useCallback(() => {
    setValue(initialValue)
    setError(undefined)
    setTouched(false)
    setIsDirty(false)
  }, [initialValue])

  // Get input props
  const getInputProps = useCallback(() => {
    return {
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    }
  }, [value, handleChange, handleBlur])

  return {
    value,
    error,
    touched,
    isDirty,
    handleChange,
    handleBlur,
    reset,
    getInputProps,
  }
}
