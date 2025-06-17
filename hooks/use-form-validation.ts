"use client"

import type React from "react"

import { useState, useCallback } from "react"

export interface ValidationRule<T = any> {
  validator: (value: T, formValues?: Record<string, any>) => boolean
  message: string
}

export interface FieldValidation<T = any> {
  value: T
  rules: ValidationRule<T>[]
  dependsOn?: string[]
}

export interface ValidationSchema {
  [field: string]: FieldValidation
}

export interface ValidationErrors {
  [field: string]: string | undefined
}

export interface UseFormValidationOptions {
  schema: ValidationSchema
  initialValues?: Record<string, any>
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export function useFormValidation({
  schema,
  initialValues = {},
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormValidationOptions) {
  const [values, setValues] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isValid, setIsValid] = useState(true)

  // Validate a single field
  const validateField = useCallback(
    (fieldName: string, fieldValue: any) => {
      const fieldSchema = schema[fieldName]
      if (!fieldSchema) return undefined

      // Run through all validation rules for this field
      for (const rule of fieldSchema.rules) {
        if (!rule.validator(fieldValue, values)) {
          return rule.message
        }
      }

      return undefined
    },
    [schema, values],
  )

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {}
    let formIsValid = true

    // Validate each field in the schema
    Object.keys(schema).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        formIsValid = false
      }
    })

    setErrors(newErrors)
    setIsValid(formIsValid)

    return { errors: newErrors, isValid: formIsValid }
  }, [schema, validateField, values])

  // Handle field change
  const handleChange = useCallback(
    (fieldName: string, value: any) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }))
      setTouched((prev) => ({ ...prev, [fieldName]: true }))

      if (validateOnChange) {
        const error = validateField(fieldName, value)

        setErrors((prev) => {
          const newErrors = { ...prev }
          if (error) {
            newErrors[fieldName] = error
          } else {
            delete newErrors[fieldName]
          }
          return newErrors
        })

        // Also validate dependent fields
        Object.keys(schema).forEach((name) => {
          if (schema[name].dependsOn?.includes(fieldName)) {
            const dependentError = validateField(name, values[name])

            setErrors((prev) => {
              const newErrors = { ...prev }
              if (dependentError) {
                newErrors[name] = dependentError
              } else {
                delete newErrors[name]
              }
              return newErrors
            })
          }
        })

        // Update isValid state
        setIsValid(Object.keys(errors).length === 0)
      }
    },
    [schema, validateField, validateOnChange, values, errors],
  )

  // Handle field blur
  const handleBlur = useCallback(
    (fieldName: string) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }))

      if (validateOnBlur) {
        const error = validateField(fieldName, values[fieldName])

        setErrors((prev) => {
          const newErrors = { ...prev }
          if (error) {
            newErrors[fieldName] = error
          } else {
            delete newErrors[fieldName]
          }
          return newErrors
        })

        // Update isValid state
        setIsValid(Object.keys(errors).length === 0)
      }
    },
    [validateField, validateOnBlur, values, errors],
  )

  // Reset form
  const resetForm = useCallback(
    (newValues = initialValues) => {
      setValues(newValues)
      setErrors({})
      setTouched({})
      setIsValid(true)
    },
    [initialValues],
  )

  // Set a specific field value
  const setFieldValue = useCallback(
    (fieldName: string, value: any) => {
      handleChange(fieldName, value)
    },
    [handleChange],
  )

  // Set multiple field values at once
  const setFieldValues = useCallback(
    (newValues: Record<string, any>) => {
      setValues((prev) => ({ ...prev, ...newValues }))

      if (validateOnChange) {
        const newErrors: ValidationErrors = { ...errors }
        let formIsValid = true

        Object.keys(newValues).forEach((fieldName) => {
          const error = validateField(fieldName, newValues[fieldName])
          if (error) {
            newErrors[fieldName] = error
            formIsValid = false
          } else {
            delete newErrors[fieldName]
          }

          // Also validate dependent fields
          Object.keys(schema).forEach((name) => {
            if (schema[name].dependsOn?.includes(fieldName)) {
              const dependentError = validateField(name, values[name])
              if (dependentError) {
                newErrors[name] = dependentError
                formIsValid = false
              } else {
                delete newErrors[name]
              }
            }
          })
        })

        setErrors(newErrors)
        setIsValid(formIsValid)
      }
    },
    [errors, schema, validateField, validateOnChange, values],
  )

  // Get field props
  const getFieldProps = useCallback(
    (fieldName: string) => {
      return {
        name: fieldName,
        value: values[fieldName] || "",
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
          handleChange(fieldName, e.target.value),
        onBlur: () => handleBlur(fieldName),
        error: errors[fieldName],
        touched: touched[fieldName] || false,
      }
    },
    [values, handleChange, handleBlur, errors, touched],
  )

  return {
    values,
    errors,
    touched,
    isValid,
    validateField,
    validateForm,
    handleChange,
    handleBlur,
    resetForm,
    setFieldValue,
    setFieldValues,
    getFieldProps,
  }
}
