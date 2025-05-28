"use client"

import { useState, useCallback } from "react"

interface PaymentDetails {
  total: {
    label: string
    amount: {
      currency: string
      value: string
    }
  }
  displayItems?: Array<{
    label: string
    amount: {
      currency: string
      value: string
    }
  }>
}

export function usePaymentRequest() {
  const [isSupported, setIsSupported] = useState(false)

  const checkSupport = useCallback(() => {
    const supported = typeof window !== "undefined" && !!window.PaymentRequest
    setIsSupported(supported)
    return supported
  }, [])

  const makePayment = useCallback(
    async (details: PaymentDetails) => {
      if (!isSupported) {
        throw new Error("Payment Request API not supported")
      }

      try {
        const supportedInstruments = [
          {
            supportedMethods: "basic-card",
            data: {
              supportedNetworks: ["visa", "mastercard", "amex"],
              supportedTypes: ["debit", "credit"],
            },
          },
        ]

        const paymentRequest = new PaymentRequest(supportedInstruments, details)

        const paymentResponse = await paymentRequest.show()

        // Process payment with your payment processor
        await paymentResponse.complete("success")

        return paymentResponse
      } catch (error) {
        console.error("Payment Request failed:", error)
        throw error
      }
    },
    [isSupported],
  )

  return {
    isSupported,
    checkSupport,
    makePayment,
  }
}
