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

import { useState, useEffect, useCallback } from "react"
import type { TourConfig, TourStep } from "@/lib/tour-config"

interface UseTourOptions {
  onComplete?: () => void
  onSkip?: () => void
  onStepChange?: (step: TourStep, index: number) => void
  autoStart?: boolean
  localStorage?: boolean
}

export function useTour(tourConfig: TourConfig, options: UseTourOptions = {}) {
  const [isActive, setIsActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  const currentStep = tourConfig.steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === tourConfig.steps.length - 1
  const progress = ((currentStepIndex + 1) / tourConfig.steps.length) * 100

  // Check if tour was previously completed
  useEffect(() => {
    if (options.localStorage) {
      const completed = localStorage.getItem(`tour-completed-${tourConfig.id}`)
      setHasCompleted(completed === "true")
    }
  }, [tourConfig.id, options.localStorage])

  // Auto-start tour if configured
  useEffect(() => {
    if (options.autoStart && !hasCompleted && !isActive) {
      startTour()
    }
  }, [options.autoStart, hasCompleted])

  const startTour = useCallback(() => {
    setIsActive(true)
    setIsVisible(true)
    setCurrentStepIndex(0)
    options.onStepChange?.(tourConfig.steps[0], 0)
  }, [tourConfig.steps, options])

  const nextStep = useCallback(() => {
    if (isLastStep) {
      completeTour()
    } else {
      const nextIndex = currentStepIndex + 1
      setCurrentStepIndex(nextIndex)
      options.onStepChange?.(tourConfig.steps[nextIndex], nextIndex)
    }
  }, [currentStepIndex, isLastStep, tourConfig.steps, options])

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      const prevIndex = currentStepIndex - 1
      setCurrentStepIndex(prevIndex)
      options.onStepChange?.(tourConfig.steps[prevIndex], prevIndex)
    }
  }, [currentStepIndex, isFirstStep, tourConfig.steps, options])

  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < tourConfig.steps.length) {
        setCurrentStepIndex(stepIndex)
        options.onStepChange?.(tourConfig.steps[stepIndex], stepIndex)
      }
    },
    [tourConfig.steps, options],
  )

  const skipTour = useCallback(() => {
    setIsActive(false)
    setIsVisible(false)
    options.onSkip?.()
  }, [options])

  const completeTour = useCallback(() => {
    setIsActive(false)
    setIsVisible(false)
    setHasCompleted(true)

    if (options.localStorage) {
      localStorage.setItem(`tour-completed-${tourConfig.id}`, "true")
    }

    options.onComplete?.()
  }, [tourConfig.id, options])

  const resetTour = useCallback(() => {
    setIsActive(false)
    setIsVisible(false)
    setCurrentStepIndex(0)
    setHasCompleted(false)

    if (options.localStorage) {
      localStorage.removeItem(`tour-completed-${tourConfig.id}`)
    }
  }, [tourConfig.id, options])

  return {
    // State
    isActive,
    isVisible,
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    progress,
    hasCompleted,

    // Actions
    startTour,
    nextStep,
    prevStep,
    goToStep,
    skipTour,
    completeTour,
    resetTour,

    // Config
    tourConfig,
  }
}
