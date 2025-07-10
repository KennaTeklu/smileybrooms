"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface CheckoutProgressProps {
  currentStep: number // 1-indexed
  totalSteps: number
  stepNames: string[] // e.g., ["Contact", "Address", "Payment", "Review"]
}

export function CheckoutProgress({ currentStep, totalSteps, stepNames }: CheckoutProgressProps) {
  const progressValue = (currentStep / totalSteps) * 100

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
        {stepNames.map((name, index) => (
          <span
            key={name}
            className={cn(
              currentStep >= index + 1 ? "text-gray-900 dark:text-gray-50" : "",
              currentStep === index + 1 ? "font-bold" : "",
            )}
          >
            {name}
          </span>
        ))}
      </div>
      <Progress value={progressValue} className="w-full h-2" />
      <div className="text-center text-sm text-gray-600 mt-2">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  )
}
