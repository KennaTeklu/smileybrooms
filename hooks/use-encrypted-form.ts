/**
 * Hook for managing encrypted form data
 */

"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useForm, type UseFormOptions, type FormState } from "./use-form"
import {
  useFieldEncryption,
  type EncryptedData,
  generateEncryptionKey,
  shouldEncryptField,
} from "@/lib/security/field-encryption"

export interface UseEncryptedFormOptions extends UseFormOptions {
  /**
   * Fields that should be encrypted
   */
  sensitiveFields?: string[]

  /**
   * Whether to automatically detect sensitive fields
   */
  autoDetectSensitiveFields?: boolean

  /**
   * Initial encryption key
   */
  encryptionKey?: string

  /**
   * Whether to store the encryption key in session storage
   */
  persistKey?: boolean

  /**
   * Unique identifier for the form (used for key storage)
   */
  formId?: string
}

export function useEncryptedForm({
  sensitiveFields = [],
  autoDetectSensitiveFields = true,
  encryptionKey: initialKey,
  persistKey = true,
  formId = "encrypted_form",
  ...formOptions
}: UseEncryptedFormOptions = {}) {
  // Initialize the base form
  const form = useForm(formOptions)

  // Track detected sensitive fields
  const [detectedSensitiveFields, setDetectedSensitiveFields] = useState<string[]>([])

  // Combine explicitly defined and auto-detected sensitive fields
  const allSensitiveFields = [...sensitiveFields, ...detectedSensitiveFields]

  // Get the stored key or generate a new one
  const getInitialKey = useCallback(() => {
    if (initialKey) return initialKey

    if (persistKey && typeof sessionStorage !== "undefined") {
      const storedKey = sessionStorage.getItem(`encryption_key_${formId}`)
      if (storedKey) return storedKey
    }

    const newKey = generateEncryptionKey()
    if (persistKey && typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(`encryption_key_${formId}`, newKey)
    }

    return newKey
  }, [initialKey, persistKey, formId])

  // Initialize encryption utilities
  const {
    encryptionKey,
    encryptField,
    decryptField,
    encryptFields,
    decryptFields,
    changeEncryptionKey,
    regenerateKey,
  } = useFieldEncryption(getInitialKey(), allSensitiveFields)

  // Store the key when it changes
  useEffect(() => {
    if (persistKey && typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(`encryption_key_${formId}`, encryptionKey)
    }
  }, [encryptionKey, persistKey, formId])

  // Auto-detect sensitive fields if enabled
  useEffect(() => {
    if (!autoDetectSensitiveFields) return

    const newDetectedFields: string[] = []

    Object.entries(form.values).forEach(([fieldName, value]) => {
      // Skip fields that are already marked as sensitive
      if (sensitiveFields.includes(fieldName)) return

      // Skip fields that are already detected
      if (detectedSensitiveFields.includes(fieldName)) return

      // Check if the field should be encrypted
      if (shouldEncryptField(fieldName, value)) {
        newDetectedFields.push(fieldName)
      }
    })

    if (newDetectedFields.length > 0) {
      setDetectedSensitiveFields((prev) => [...prev, ...newDetectedFields])
    }
  }, [form.values, autoDetectSensitiveFields, sensitiveFields, detectedSensitiveFields])

  // Enhanced submit handler that encrypts sensitive fields
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()

      // Validate the form
      const isValid = await form.handleSubmit(e)

      if (isValid && allSensitiveFields.length > 0) {
        try {
          // Encrypt sensitive fields
          const encryptedValues = await encryptFields(form.values)

          // Call the original onSubmit with encrypted values
          if (formOptions.onSubmit) {
            await formOptions.onSubmit(
              encryptedValues as Record<string, string>,
              {
                ...form,
                values: encryptedValues as Record<string, string>,
              } as FormState,
            )
          }
        } catch (error) {
          console.error("Error encrypting form data:", error)
          return false
        }
      }

      return isValid
    },
    [form, formOptions.onSubmit, encryptFields],
  )

  // Decrypt encrypted values
  const decryptValues = useCallback(
    async (encryptedValues: Record<string, string | EncryptedData>): Promise<Record<string, string>> => {
      return decryptFields(encryptedValues)
    },
    [decryptFields],
  )

  return {
    ...form,
    handleSubmit,
    encryptionKey,
    sensitiveFields: allSensitiveFields,
    encryptField,
    decryptField,
    encryptFields,
    decryptFields,
    decryptValues,
    changeEncryptionKey,
    regenerateKey,
    isFieldSensitive: (fieldName: string) => allSensitiveFields.includes(fieldName),
  }
}
