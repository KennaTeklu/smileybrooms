"use client"

import type React from "react"

import { useState, useCallback } from "react"

export interface FormField {
  value: string
  error?: string
  touched: boolean
  required?: boolean
  validators?: Array<(value: string, formValues?: Record<string, any>) => string | undefined>
}

export interface FormState {
  values: Record<string, string>
  fields: Record<string, FormField>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
  submitCount: number
}

export interface UseFormOptions {
  initialValues?: Record<string, string>
  validationSchema?: Record<string, Array<(value: string, formValues?: Record<string, any>) => string | undefined>>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  validateOnSubmit?: boolean
  onSubmit?: (values: Record<string, string>, formState: FormState) => Promise<void> | void
}

export function useForm({
  initialValues = {},
  validationSchema = {},
  validateOnChange = true,
  validateOnBlur = true,
  validateOnSubmit = true,
  onSubmit,
}: UseFormOptions = {}) {
  // Initialize form state
  const [formState, setFormState] = useState<FormState>(() => {
    const fields: Record<string, FormField> = {}
    const errors: Record<string, string> = {}
    const touched: Record<string, boolean> = {}

    // Initialize fields from initialValues and validationSchema
    Object.keys({ ...initialValues, ...validationSchema }).forEach((fieldName) => {
      fields[fieldName] = {
        value: initialValues[fieldName] || "",
        touched: false,
        required: validationSchema[fieldName]?.some((validator) => validator.toString().includes("required")),
        validators: validationSchema[fieldName] || [],
      }
      touched[fieldName] = false
    })

    return {
      values: { ...initialValues },
      fields,
      errors: {},
      touched,
      isValid: true,
      isDirty: false,
      isSubmitting: false,
      submitCount: 0,
    }
  })

  // Validate a single field
  const validateSingleField = useCallback(
    (fieldName: string, value: string) => {
      const field = formState.fields[fieldName]
      if (!field) return undefined

      // Run through all validators for this field
      if (field.validators && field.validators.length > 0) {
        for (const validator of field.validators) {
          const error = validator(value, formState.values)
          if (error) return error
        }
      }

      return undefined
    },
    [formState.fields, formState.values],
  )

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    Object.keys(formState.fields).forEach((fieldName) => {
      const error = validateSingleField(fieldName, formState.values[fieldName] || "")
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    return { errors: newErrors, isValid }
  }, [formState.fields, formState.values, validateSingleField])

  // Update form state when a field changes
  const handleChange = useCallback(
    (fieldName: string, value: string) => {
      setFormState((prevState) => {
        // Create new state objects to maintain immutability
        const newValues = { ...prevState.values, [fieldName]: value }
        const newFields = {
          ...prevState.fields,
          [fieldName]: {
            ...prevState.fields[fieldName],
            value,
            touched: true,
          },
        }
        const newTouched = { ...prevState.touched, [fieldName]: true }

        // Validate if needed
        const newErrors = { ...prevState.errors }
        let isValid = prevState.isValid

        if (validateOnChange && newFields[fieldName]) {
          const error = validateSingleField(fieldName, value)

          if (error) {
            newErrors[fieldName] = error
            isValid = false
          } else {
            delete newErrors[fieldName]
            // Recheck if form is valid
            isValid = Object.keys(newErrors).length === 0
          }
        }

        return {
          ...prevState,
          values: newValues,
          fields: newFields,
          errors: newErrors,
          touched: newTouched,
          isValid,
          isDirty: true,
        }
      })
    },
    [validateOnChange, validateSingleField],
  )

  // Handle field blur
  const handleBlur = useCallback(
    (fieldName: string) => {
      if (!validateOnBlur) return

      setFormState((prevState) => {
        const newTouched = { ...prevState.touched, [fieldName]: true }
        const newFields = {
          ...prevState.fields,
          [fieldName]: {
            ...prevState.fields[fieldName],
            touched: true,
          },
        }

        // Validate field on blur
        const newErrors = { ...prevState.errors }
        let isValid = prevState.isValid

        const error = validateSingleField(fieldName, prevState.values[fieldName] || "")

        if (error) {
          newErrors[fieldName] = error
          isValid = false
        } else {
          delete newErrors[fieldName]
          // Recheck if form is valid
          isValid = Object.keys(newErrors).length === 0
        }

        return {
          ...prevState,
          fields: newFields,
          errors: newErrors,
          touched: newTouched,
          isValid,
        }
      })
    },
    [validateOnBlur, validateSingleField],
  )

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()

      setFormState((prevState) => ({
        ...prevState,
        isSubmitting: true,
        submitCount: prevState.submitCount + 1,
      }))

      // Validate all fields if validateOnSubmit is true
      let errors = formState.errors
      let isValid = formState.isValid

      if (validateOnSubmit) {
        const validation = validateForm()
        errors = validation.errors
        isValid = validation.isValid

        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {}
        Object.keys(formState.fields).forEach((fieldName) => {
          allTouched[fieldName] = true
        })

        setFormState((prevState) => ({
          ...prevState,
          errors,
          isValid,
          touched: allTouched,
        }))
      }

      // If form is valid and onSubmit callback is provided, call it
      if (isValid && onSubmit) {
        try {
          await onSubmit(formState.values, formState)
        } catch (error) {
          console.error("Form submission error:", error)
        }
      }

      setFormState((prevState) => ({
        ...prevState,
        isSubmitting: false,
      }))

      return isValid
    },
    [formState, validateForm, validateOnSubmit, onSubmit],
  )

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setFormState((prevState) => {
      const fields: Record<string, FormField> = {}
      const touched: Record<string, boolean> = {}

      Object.keys(prevState.fields).forEach((fieldName) => {
        fields[fieldName] = {
          ...prevState.fields[fieldName],
          value: initialValues[fieldName] || "",
          touched: false,
        }
        touched[fieldName] = false
      })

      return {
        values: { ...initialValues },
        fields,
        errors: {},
        touched,
        isValid: true,
        isDirty: false,
        isSubmitting: false,
        submitCount: prevState.submitCount,
      }
    })
  }, [initialValues])

  // Set a specific field value programmatically
  const setFieldValue = useCallback(
    (fieldName: string, value: string) => {
      handleChange(fieldName, value)
    },
    [handleChange],
  )

  // Set multiple field values at once
  const setValues = useCallback((newValues: Record<string, string>) => {
    setFormState((prevState) => {
      const updatedValues = { ...prevState.values, ...newValues }
      const updatedFields = { ...prevState.fields }

      // Update field values
      Object.keys(newValues).forEach((fieldName) => {
        if (updatedFields[fieldName]) {
          updatedFields[fieldName] = {
            ...updatedFields[fieldName],
            value: newValues[fieldName],
          }
        }
      })

      return {
        ...prevState,
        values: updatedValues,
        fields: updatedFields,
        isDirty: true,
      }
    })
  }, [])

  // Set a field error manually
  const setFieldError = useCallback((fieldName: string, error: string) => {
    setFormState((prevState) => ({
      ...prevState,
      errors: {
        ...prevState.errors,
        [fieldName]: error,
      },
      isValid: false,
    }))
  }, [])

  // Clear a field error
  const clearFieldError = useCallback((fieldName: string) => {
    setFormState((prevState) => {
      const newErrors = { ...prevState.errors }
      delete newErrors[fieldName]

      return {
        ...prevState,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      }
    })
  }, [])

  // Get props for a field
  const getFieldProps = useCallback(
    (fieldName: string) => {
      return {
        name: fieldName,
        value: formState.values[fieldName] || "",
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
          handleChange(fieldName, e.target.value),
        onBlur: () => handleBlur(fieldName),
      }
    },
    [formState.values, handleChange, handleBlur],
  )

  // Return form state and methods
  return {
    // Form state
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
    submitCount: formState.submitCount,

    // Field methods
    handleChange,
    handleBlur,
    setFieldValue,
    setValues,
    setFieldError,
    clearFieldError,
    getFieldProps,

    // Form methods
    handleSubmit,
    resetForm,
    validateForm,
  }
}
