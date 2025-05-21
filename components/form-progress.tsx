"use client"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

export interface FormProgressProps {
  steps: Array<{
    id: string
    title: string
    description?: string
    isOptional?: boolean
  }>
  currentStepId: string
  completedSteps: Record<string, boolean>
  onStepClick?: (stepId: string) => void
  className?: string
  orientation?: "horizontal" | "vertical"
  showLabels?: boolean
  showPercentage?: boolean
  showStepNumbers?: boolean
  variant?: "default" | "outline" | "pills"
}

export function FormProgress({
  steps,
  currentStepId,
  completedSteps,
  onStepClick,
  className,
  orientation = "horizontal",
  showLabels = true,
  showPercentage = false,
  showStepNumbers = false,
  variant = "default",
}: FormProgressProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId)

  // Calculate overall progress percentage
  const completedCount = Object.values(completedSteps).filter(Boolean).length
  const progressPercentage = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0

  return (
    <div className={cn("w-full", orientation === "vertical" ? "flex flex-col space-y-4" : "space-y-2", className)}>
      {/* Progress percentage display */}
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{progressPercentage}%</span>
        </div>
      )}

      {/* Progress bar or steps */}
      <div className={cn("relative", orientation === "vertical" ? "flex flex-col space-y-4" : "flex space-x-2")}>
        {/* Progress line for default variant */}
        {variant === "default" && orientation === "horizontal" && (
          <div className="absolute top-1/2 left-0 h-0.5 bg-gray-200 w-full -translate-y-1/2 z-0" />
        )}

        {steps.map((step, index) => {
          const isCompleted = !!completedSteps[step.id]
          const isCurrent = step.id === currentStepId
          const isClickable = onStepClick && (isCompleted || index <= currentStepIndex + 1)

          return (
            <div
              key={step.id}
              className={cn(
                "relative flex",
                orientation === "vertical" ? "flex-row items-center" : "flex-col items-center",
                "flex-1",
              )}
            >
              {/* Step indicator */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={isClickable ? () => onStepClick(step.id) : undefined}
                className={cn(
                  "relative z-10 flex items-center justify-center rounded-full transition-all",
                  variant === "default" && [
                    "w-8 h-8 border-2",
                    isCompleted
                      ? "bg-green-600 border-green-600 text-white"
                      : isCurrent
                        ? "border-green-600 text-green-600"
                        : "border-gray-300 text-gray-300",
                  ],
                  variant === "outline" && [
                    "w-8 h-8 border",
                    isCompleted
                      ? "bg-green-50 border-green-600 text-green-600"
                      : isCurrent
                        ? "border-green-600 text-green-600"
                        : "border-gray-300 text-gray-300",
                  ],
                  variant === "pills" && [
                    "w-10 h-6 rounded-full text-xs font-medium",
                    isCompleted
                      ? "bg-green-600 text-white"
                      : isCurrent
                        ? "bg-green-100 text-green-800 border border-green-600"
                        : "bg-gray-100 text-gray-400 border border-gray-300",
                  ],
                  isClickable ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed",
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? <CheckIcon className="w-4 h-4" /> : showStepNumbers ? index + 1 : null}
              </button>

              {/* Connector line for vertical orientation */}
              {orientation === "vertical" && index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-8 left-4 w-0.5 h-full -translate-x-1/2",
                    isCompleted ? "bg-green-600" : "bg-gray-200",
                  )}
                />
              )}

              {/* Step label */}
              {showLabels && (
                <div
                  className={cn(
                    "text-sm",
                    orientation === "vertical" ? "ml-4" : "mt-2",
                    isCurrent ? "font-medium" : "font-normal",
                    isCurrent ? "text-gray-900" : "text-gray-500",
                  )}
                >
                  <div>{step.title}</div>
                  {step.description && <div className="text-xs text-gray-400">{step.description}</div>}
                  {step.isOptional && <div className="text-xs italic text-gray-400">(Optional)</div>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
