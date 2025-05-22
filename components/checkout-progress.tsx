"use client"

import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutStep {
  id: string
  label: string
  description?: string
}

interface CheckoutProgressProps {
  steps: CheckoutStep[]
  currentStep: string
  completedSteps: string[]
  className?: string
}

export function CheckoutProgress({ steps, currentStep, completedSteps, className }: CheckoutProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id)
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="relative flex flex-col items-center flex-1">
              {/* Line connecting steps */}
              {!isLast && (
                <div
                  className={cn("absolute top-4 w-full h-0.5 left-1/2", isCompleted ? "bg-blue-600" : "bg-gray-200")}
                />
              )}

              {/* Step circle */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2",
                  isActive
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : isCompleted
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-400",
                )}
              >
                {isCompleted ? <CheckCircle className="h-4 w-4" /> : <span>{index + 1}</span>}
              </div>

              {/* Step label */}
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-blue-600" : isCompleted ? "text-gray-900" : "text-gray-500",
                  )}
                >
                  {step.label}
                </div>
                {step.description && <div className="text-xs text-gray-500 hidden md:block">{step.description}</div>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile version */}
      <div className="flex md:hidden items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id)
          const currentIndex = steps.findIndex((s) => s.id === currentStep)

          // Only show current step on mobile
          if (!isActive) return null

          return (
            <div key={step.id} className="flex items-center w-full">
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full mr-2",
                  isActive ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700",
                )}
              >
                <span className="text-xs">{index + 1}</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{step.label}</div>
                <div className="text-xs text-gray-500">
                  Step {index + 1} of {steps.length}
                </div>
              </div>
              <div className="text-sm font-medium">
                {currentIndex + 1}/{steps.length}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
