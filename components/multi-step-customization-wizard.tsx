"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"

interface Step {
  id: string
  label: string
  content: React.ReactNode
  isComplete?: boolean
}

interface MultiStepCustomizationWizardProps {
  steps: Step[]
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const MultiStepCustomizationWizard: React.FC<MultiStepCustomizationWizardProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const currentStep = steps[currentStepIndex]

  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0)
      setCompletedSteps([])
    }
  }, [isOpen])

  useEffect(() => {
    const allStepsCompleted = steps.every((step) => completedSteps.includes(step.id))

    if (allStepsCompleted && completedSteps.length > 0) {
      onComplete()
    }
  }, [completedSteps, steps, onComplete])

  // Add auto-scroll to top when wizard opens for better visibility
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [isOpen])

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }, [isLastStep, onComplete])

  const handleBack = useCallback(() => {
    setCurrentStepIndex((prev) => prev - 1)
  }, [])

  const handleCompleteStep = useCallback(() => {
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps((prev) => [...prev, currentStep.id])
    }
  }, [completedSteps, currentStep.id])

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75">
      <div className="relative w-auto mx-auto max-w-2xl my-20">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{currentStep.label}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="p-4">{currentStep.content}</div>

          <div className="flex justify-between p-4 border-t">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">
              Cancel
            </button>
            <div>
              {!isFirstStep && (
                <button onClick={handleBack} className="px-4 py-2 mr-2 text-gray-600 rounded hover:bg-gray-100">
                  Back
                </button>
              )}
              <button onClick={handleNext} className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">
                {isLastStep ? "Complete" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiStepCustomizationWizard
