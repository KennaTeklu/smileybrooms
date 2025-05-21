"use client"

import type React from "react"

import { useState, useCallback } from "react"
import * as maskingUtils from "@/lib/masking"

type MaskType = "phone" | "creditCard" | "date" | "currency" | "ssn" | "zip" | "custom"

interface UseMaskedFieldOptions {
  initialValue?: string
  maskType: MaskType
  customMask?: string
  customPattern?: string
  onChange?: (value: string, rawValue: string) => void
  onBlur?: (value: string, rawValue: string) => void
  maskOptions?: any[]
}

export function useMaskedField({
  initialValue = "",
  maskType,
  customMask,
  customPattern,
  onChange,
  onBlur,
  maskOptions = [],
}: UseMaskedFieldOptions) {
  const [value, setValue] = useState(initialValue)
  const [rawValue, setRawValue] = useState(initialValue.replace(/\D/g, ""))

  // Apply the appropriate mask based on maskType
  const applyMask = useCallback(
    (inputValue: string): string => {
      switch (maskType) {
        case "phone":
          return maskingUtils.maskPhone(inputValue, ...(maskOptions as ["US" | "INTL"]))
        case "creditCard":
          return maskingUtils.maskCreditCard(inputValue, ...(maskOptions as ["standard" | "amex"]))
        case "date":
          return maskingUtils.maskDate(inputValue, ...(maskOptions as ["MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD"]))
        case "currency":
          return maskingUtils.maskCurrency(inputValue, ...(maskOptions as [string, string]))
        case "ssn":
          return maskingUtils.maskSSN(inputValue)
        case "zip":
          return maskingUtils.maskZip(inputValue, ...(maskOptions as ["US" | "US_PLUS_4" | "CA"]))
        case "custom":
          if (customMask && customPattern) {
            return maskingUtils.applyMask(inputValue, customPattern)
          }
          return inputValue
        default:
          return inputValue
      }
    },
    [maskType, customMask, customPattern, maskOptions],
  )

  // Remove mask to get raw value
  const removeMask = useCallback(
    (maskedValue: string): string => {
      if (maskType === "custom" && customPattern) {
        return maskingUtils.removeMask(maskedValue, customPattern)
      }

      // For most masks, just remove non-digits
      return maskedValue.replace(/\D/g, "")
    },
    [maskType, customPattern],
  )

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const inputValue = typeof e === "string" ? e : e.target.value
      const unmaskedValue = removeMask(inputValue)
      const maskedValue = applyMask(unmaskedValue)

      setValue(maskedValue)
      setRawValue(unmaskedValue)

      if (onChange) {
        onChange(maskedValue, unmaskedValue)
      }
    },
    [applyMask, removeMask, onChange],
  )

  // Handle input blur
  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur(value, rawValue)
    }
  }, [value, rawValue, onBlur])

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
    rawValue,
    handleChange,
    handleBlur,
    getInputProps,
  }
}
