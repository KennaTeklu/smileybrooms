"use client"

import { useState, useEffect } from "react"
import { AB_TEST_CONFIG, type ABTestVariation } from "@/lib/ab-test-config"

interface ABTestResult {
  variationName: string
  content: { [key: string]: string }
}

export function useABTest(testName: string): ABTestResult {
  const [result, setResult] = useState<ABTestResult>({
    variationName: AB_TEST_CONFIG[testName]?.defaultVariation || "default",
    content:
      AB_TEST_CONFIG[testName]?.variations.find((v) => v.name === AB_TEST_CONFIG[testName]?.defaultVariation)
        ?.content || {},
  })

  useEffect(() => {
    const config = AB_TEST_CONFIG[testName]
    if (!config) {
      console.warn(`AB Test configuration for "${testName}" not found.`)
      return
    }

    const storedVariation = localStorage.getItem(`ab_test_${testName}`)
    let selectedVariation: ABTestVariation | undefined

    if (storedVariation) {
      selectedVariation = config.variations.find((v) => v.name === storedVariation)
    }

    if (!selectedVariation) {
      // Assign a new variation if not stored or invalid
      const randomNumber = Math.random() * 100
      let cumulativeWeight = 0
      for (const variation of config.variations) {
        cumulativeWeight += variation.weight
        if (randomNumber <= cumulativeWeight) {
          selectedVariation = variation
          break
        }
      }

      // Fallback to default if no variation is selected (shouldn't happen with correct weights)
      if (!selectedVariation) {
        selectedVariation = config.variations.find((v) => v.name === config.defaultVariation)
      }

      if (selectedVariation) {
        localStorage.setItem(`ab_test_${testName}`, selectedVariation.name)
      }
    }

    if (selectedVariation) {
      setResult({
        variationName: selectedVariation.name,
        content: selectedVariation.content,
      })
      // In a real scenario, you'd send this to your analytics platform
      console.log(`AB Test "${testName}": User assigned to variation "${selectedVariation.name}"`)
    }
  }, [testName])

  return result
}
