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
"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, ChevronLeft, ChevronRight, SkipForward, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTour } from "@/hooks/use-tour"
import type { TourConfig, TourStep } from "@/lib/tour-config"

interface TourGuideProps {
  tourConfig: TourConfig
  onComplete?: () => void
  onSkip?: () => void
  autoStart?: boolean
  className?: string
}

interface TourTooltipProps {
  step: TourStep
  isVisible: boolean
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
  progress: number
  showProgress: boolean
}

function TourTooltip({
  step,
  isVisible,
  onNext,
  onPrev,
  onSkip,
  onClose,
  isFirstStep,
  isLastStep,
  progress,
  showProgress,
}: TourTooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isVisible) return

    const updatePosition = () => {
      const target = document.querySelector(step.target) as HTMLElement
      if (!target || !tooltipRef.current) return

      setTargetElement(target)
      const targetRect = target.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      let top = 0
      let left = 0

      // Calculate position based on placement
      switch (step.placement) {
        case "top":
          top = targetRect.top - tooltipRect.height - 10
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2
          break
        case "bottom":
          top = targetRect.bottom + 10
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2
          break
        case "left":
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2
          left = targetRect.left - tooltipRect.width - 10
          break
        case "right":
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2
          left = targetRect.right + 10
          break
        case "center":
          top = (viewport.height - tooltipRect.height) / 2
          left = (viewport.width - tooltipRect.width) / 2
          break
      }

      // Ensure tooltip stays within viewport
      top = Math.max(10, Math.min(top, viewport.height - tooltipRect.height - 10))
      left = Math.max(10, Math.min(left, viewport.width - tooltipRect.width - 10))

      setPosition({ top, left })

      // Scroll target into view if needed
      if (step.placement !== "center") {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        })
      }
    }

    // Initial position calculation
    setTimeout(updatePosition, 100)

    // Update position on scroll and resize
    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)

    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [step, isVisible])

  // Create spotlight effect
  useEffect(() => {
    if (!isVisible || !step.spotlight || !targetElement) return

    const spotlight = document.createElement("div")
    spotlight.className = "tour-spotlight"
    spotlight.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      pointer-events: none;
      z-index: 9998;
      transition: all 0.3s ease;
    `

    const targetRect = targetElement.getBoundingClientRect()
    const clipPath = `polygon(
      0% 0%, 
      0% 100%, 
      ${targetRect.left - 5}px 100%, 
      ${targetRect.left - 5}px ${targetRect.top - 5}px, 
      ${targetRect.right + 5}px ${targetRect.top - 5}px, 
      ${targetRect.right + 5}px ${targetRect.bottom + 5}px, 
      ${targetRect.left - 5}px ${targetRect.bottom + 5}px, 
      ${targetRect.left - 5}px 100%, 
      100% 100%, 
      100% 0%
    )`

    spotlight.style.clipPath = clipPath

    document.body.appendChild(spotlight)

    return () => {
      if (document.body.contains(spotlight)) {
        document.body.removeChild(spotlight)
      }
    }
  }, [step, isVisible, targetElement])

  if (!isVisible) return null

  return createPortal(
    <div ref={tooltipRef} className="fixed z-[9999] max-w-sm" style={{ top: position.top, left: position.left }}>
      <Card className="shadow-2xl border-2 border-blue-200 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900">{step.title}</CardTitle>
              {showProgress && (
                <div className="mt-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    Step {Math.round(progress / (100 / ((progress / 100) * 10)))} of{" "}
                    {Math.round(100 / (100 / ((progress / 100) * 10)))}
                  </p>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-gray-700 mb-4">{step.content}</CardDescription>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button variant="outline" size="sm" onClick={onPrev} className="flex items-center gap-1">
                  <ChevronLeft className="h-3 w-3" />
                  {step.prevButton || "Previous"}
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {step.skipButton && (
                <Button variant="ghost" size="sm" onClick={onSkip} className="text-gray-500 hover:text-gray-700">
                  <SkipForward className="h-3 w-3 mr-1" />
                  {step.skipButton}
                </Button>
              )}

              <Button size="sm" onClick={onNext} className="flex items-center gap-1">
                {step.nextButton || (isLastStep ? "Finish" : "Next")}
                {!isLastStep && <ChevronRight className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body,
  )
}

export function TourGuide({ tourConfig, onComplete, onSkip, autoStart = false, className }: TourGuideProps) {
  const {
    isActive,
    isVisible,
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    progress,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    startTour,
  } = useTour(tourConfig, {
    onComplete,
    onSkip,
    autoStart,
    localStorage: true,
  })

  const handleClose = () => {
    if (tourConfig.allowSkip) {
      skipTour()
    }
  }

  if (!isActive || !currentStep) return null

  return (
    <TourTooltip
      step={currentStep}
      isVisible={isVisible}
      onNext={nextStep}
      onPrev={prevStep}
      onSkip={skipTour}
      onClose={handleClose}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      progress={progress}
      showProgress={tourConfig.showProgress ?? true}
    />
  )
}

// Tour trigger button component
interface TourTriggerProps {
  tourConfig: TourConfig
  children?: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function TourTrigger({
  tourConfig,
  children,
  variant = "default",
  size = "default",
  className,
}: TourTriggerProps) {
  const { startTour, hasCompleted } = useTour(tourConfig, { localStorage: true })

  return (
    <Button variant={variant} size={size} onClick={startTour} className={cn("flex items-center gap-2", className)}>
      <Play className="h-4 w-4" />
      {children || (hasCompleted ? "Replay Tour" : "Take Tour")}
    </Button>
  )
}
