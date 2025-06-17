"use client"

import { useState, useCallback, useEffect } from "react"

export interface Step {
  id: string
  title: string
  description?: string
  isOptional?: boolean
  validate?: (data: Record<string, any>) => Record<string, string> | null
  dependencies?: string[] // IDs of steps that must be completed before this one
}

export interface MultiStepFormOptions {
  steps: Step[]
  initialData?: Record<string, any>
  initialStep?: string
  onStepChange?: (prevStep: string, nextStep: string, data: Record<string, any>) => void
  onComplete?: (data: Record<string, any>) => void
  persistKey?: string // Key for persisting form data in storage
  autosave?: boolean
}

export function useMultiStepForm({
  steps,
  initialData = {},
  initialStep,
  onStepChange,
  onComplete,
  persistKey,
  autosave = false,
}: MultiStepFormOptions) {
  // Find initial step index
  const initialStepIndex = initialStep ? steps.findIndex((step) => step.id === initialStep) : 0
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex >= 0 ? initialStepIndex : 0)
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load persisted data if available
  useEffect(() => {
    if (persistKey && typeof window !== "undefined") {
      const savedData = localStorage.getItem(`form_${persistKey}`)
      const savedStepIndex = localStorage.getItem(`form_${persistKey}_step`)
      const savedCompletedSteps = localStorage.getItem(`form_${persistKey}_completed`)

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          setFormData((prev) => ({ ...prev, ...parsedData }))
        } catch (e) {
          console.error("Error parsing saved form data:", e)
        }
      }

      if (savedStepIndex) {
        const parsedIndex = Number.parseInt(savedStepIndex, 10)
        if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < steps.length) {
          setCurrentStepIndex(parsedIndex)
        }
      }

      if (savedCompletedSteps) {
        try {
          const parsedCompletedSteps = JSON.parse(savedCompletedSteps)
          setCompletedSteps(parsedCompletedSteps)
        } catch (e) {
          console.error("Error parsing saved completed steps:", e)
        }
      }
    }
  }, [persistKey, steps.length])

  // Save form data when it changes
  useEffect(() => {
    if (autosave && persistKey && typeof window !== "undefined") {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem(`form_${persistKey}`, JSON.stringify(formData))
        localStorage.setItem(`form_${persistKey}_step`, currentStepIndex.toString())
        localStorage.setItem(`form_${persistKey}_completed`, JSON.stringify(completedSteps))
      }, 500) // Debounce saves

      return () => clearTimeout(saveTimeout)
    }
  }, [formData, currentStepIndex, completedSteps, autosave, persistKey])

  // Get current step
  const currentStep = steps[currentStepIndex]

  // Check if a step can be accessed (dependencies are satisfied)
  const canAccessStep = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex]
      if (!step) return false
      if (!step.dependencies || step.dependencies.length === 0) return true

      // Check if all dependencies are completed
      return step.dependencies.every((depId) => completedSteps[depId])
    },
    [steps, completedSteps],
  )

  // Validate current step
  const validateCurrentStep = useCallback(() => {
    if (!currentStep.validate) return true

    const stepErrors = currentStep.validate(formData)
    if (stepErrors) {
      setErrors((prev) => ({
        ...prev,
        [currentStep.id]: stepErrors,
      }))
      return false
    }

    // Clear errors for this step
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[currentStep.id]
      return newErrors
    })
    return true
  }, [currentStep, formData])

  // Go to next step
  const nextStep = useCallback(() => {
    // Validate current step first
    if (!validateCurrentStep()) return false

    // Mark current step as completed
    setCompletedSteps((prev) => ({
      ...prev,
      [currentStep.id]: true,
    }))

    // Find next accessible step
    let nextIndex = currentStepIndex
    do {
      nextIndex++
    } while (nextIndex < steps.length && !canAccessStep(nextIndex))

    // If we found a valid next step
    if (nextIndex < steps.length) {
      const prevStepId = currentStep.id
      const nextStepId = steps[nextIndex].id

      setCurrentStepIndex(nextIndex)

      // Call onStepChange callback if provided
      if (onStepChange) {
        onStepChange(prevStepId, nextStepId, formData)
      }
      return true
    } else if (nextIndex >= steps.length) {
      // We've reached the end of the form
      return completeForm()
    }

    return false
  }, [currentStepIndex, steps, validateCurrentStep, canAccessStep, currentStep.id, onStepChange, formData])

  // Go to previous step
  const prevStep = useCallback(() => {
    // Find previous accessible step
    let prevIndex = currentStepIndex
    do {
      prevIndex--
    } while (prevIndex >= 0 && !canAccessStep(prevIndex))

    if (prevIndex >= 0) {
      const prevStepId = currentStep.id
      const nextStepId = steps[prevIndex].id

      setCurrentStepIndex(prevIndex)

      // Call onStepChange callback if provided
      if (onStepChange) {
        onStepChange(prevStepId, nextStepId, formData)
      }
      return true
    }

    return false
  }, [currentStepIndex, canAccessStep, currentStep.id, steps, onStepChange, formData])

  // Go to a specific step
  const goToStep = useCallback(
    (stepId: string) => {
      const stepIndex = steps.findIndex((step) => step.id === stepId)
      if (stepIndex === -1 || !canAccessStep(stepIndex)) return false

      const prevStepId = currentStep.id
      setCurrentStepIndex(stepIndex)

      // Call onStepChange callback if provided
      if (onStepChange) {
        onStepChange(prevStepId, stepId, formData)
      }
      return true
    },
    [steps, canAccessStep, currentStep.id, onStepChange, formData],
  )

  // Update form data
  const updateFormData = useCallback((newData: Record<string, any>) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }))
  }, [])

  // Complete the form
  const completeForm = useCallback(() => {
    // Validate all steps
    let isValid = true
    const newErrors: Record<string, Record<string, string>> = {}

    steps.forEach((step) => {
      if (step.validate) {
        const stepErrors = step.validate(formData)
        if (stepErrors) {
          newErrors[step.id] = stepErrors
          isValid = false
        }
      }
    })

    if (!isValid) {
      setErrors(newErrors)
      // Go to the first step with errors
      for (let i = 0; i < steps.length; i++) {
        if (newErrors[steps[i].id]) {
          setCurrentStepIndex(i)
          break
        }
      }
      return false
    }

    // All steps are valid, complete the form
    setIsSubmitting(true)

    if (onComplete) {
      try {
        onComplete(formData)
      } catch (error) {
        console.error("Error in form completion:", error)
        setIsSubmitting(false)
        return false
      }
    }

    // Clear persisted data if form is completed successfully
    if (persistKey && typeof window !== "undefined") {
      localStorage.removeItem(`form_${persistKey}`)
      localStorage.removeItem(`form_${persistKey}_step`)
      localStorage.removeItem(`form_${persistKey}_completed`)
    }

    setIsSubmitting(false)
    return true
  }, [steps, formData, onComplete, persistKey])

  // Calculate progress
  const calculateProgress = useCallback(() => {
    if (steps.length === 0) return 0

    // Count completed non-optional steps
    const requiredSteps = steps.filter((step) => !step.isOptional)
    if (requiredSteps.length === 0) return 0

    const completedRequiredSteps = requiredSteps.filter((step) => completedSteps[step.id])
    return (completedRequiredSteps.length / requiredSteps.length) * 100
  }, [steps, completedSteps])

  // Reset the form
  const resetForm = useCallback(() => {
    setFormData(initialData)
    setCurrentStepIndex(initialStepIndex >= 0 ? initialStepIndex : 0)
    setErrors({})
    setCompletedSteps({})

    // Clear persisted data
    if (persistKey && typeof window !== "undefined") {
      localStorage.removeItem(`form_${persistKey}`)
      localStorage.removeItem(`form_${persistKey}_step`)
      localStorage.removeItem(`form_${persistKey}_completed`)
    }
  }, [initialData, initialStepIndex, persistKey])

  return {
    // Step navigation
    currentStep,
    currentStepIndex,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    nextStep,
    prevStep,
    goToStep,
    canAccessStep,

    // Form data
    formData,
    updateFormData,
    errors,
    setErrors,

    // Progress tracking
    steps,
    completedSteps,
    progress: calculateProgress(),
    isStepCompleted: (stepId: string) => !!completedSteps[stepId],

    // Form actions
    validateCurrentStep,
    completeForm,
    resetForm,
    isSubmitting,
  }
}
