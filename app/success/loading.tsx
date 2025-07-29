"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Sparkles, Mail, FileText, CreditCard } from "lucide-react"

interface LoadingStep {
  id: string
  label: string
  icon: React.ReactNode
  completed: boolean
  active: boolean
}

export default function SuccessLoading() {
  const [currentStep, setCurrentStep] = useState(0)
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  const steps: LoadingStep[] = [
    {
      id: "payment",
      label: "Processing Payment",
      icon: <CreditCard className="w-5 h-5" />,
      completed: false,
      active: false,
    },
    {
      id: "confirmation",
      label: "Generating Confirmation",
      icon: <FileText className="w-5 h-5" />,
      completed: false,
      active: false,
    },
    {
      id: "email",
      label: "Sending Beautiful Email",
      icon: <Mail className="w-5 h-5" />,
      completed: false,
      active: false,
    },
    {
      id: "complete",
      label: "Booking Confirmed!",
      icon: <CheckCircle className="w-5 h-5" />,
      completed: false,
      active: false,
    },
  ]

  // Generate floating sparkles
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }))
      setSparkles(newSparkles)
    }

    generateSparkles()
    const interval = setInterval(generateSparkles, 3000)
    return () => clearInterval(interval)
  }, [])

  // Animate through steps
  useEffect(() => {
    const stepDurations = [1500, 2000, 2500, 1000] // Different durations for each step
    let totalTime = 0

    stepDurations.forEach((duration, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1)
      }, totalTime)
      totalTime += duration
    })
  }, [])

  const getStepState = (index: number): LoadingStep => {
    const step = steps[index]
    return {
      ...step,
      completed: currentStep > index,
      active: currentStep === index,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <Sparkles
            className="w-4 h-4 text-yellow-400 animate-pulse opacity-60"
            style={{
              animation: `sparkle 3s ease-in-out infinite ${sparkle.delay}s`,
            }}
          />
        </div>
      ))}

      {/* Main Content */}
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Almost There!</h1>
            <p className="text-gray-600">We're finalizing your booking and preparing your beautiful confirmation</p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((_, index) => {
              const step = getStepState(index)
              return (
                <div key={step.id} className="flex items-center space-x-4">
                  {/* Step Icon */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                      ${
                        step.completed
                          ? "bg-green-500 text-white scale-110"
                          : step.active
                            ? "bg-blue-500 text-white animate-pulse scale-105"
                            : "bg-gray-200 text-gray-400"
                      }
                    `}
                  >
                    {step.completed ? <CheckCircle className="w-5 h-5" /> : step.icon}
                  </div>

                  {/* Step Label */}
                  <div className="flex-1">
                    <p
                      className={`
                        font-medium transition-all duration-300
                        ${
                          step.completed
                            ? "text-green-700"
                            : step.active
                              ? "text-blue-700 font-semibold"
                              : "text-gray-500"
                        }
                      `}
                    >
                      {step.label}
                    </p>
                    {step.active && (
                      <div className="flex items-center mt-1">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-blue-600">Processing...</span>
                      </div>
                    )}
                  </div>

                  {/* Completion Checkmark */}
                  {step.completed && (
                    <div className="text-green-500 animate-bounce">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Encouraging Message */}
          <div className="mt-6 text-center">
            {currentStep < steps.length ? (
              <p className="text-sm text-gray-600">
                {currentStep === 0 && "🔒 Securing your payment..."}
                {currentStep === 1 && "📄 Creating your booking details..."}
                {currentStep === 2 && "📧 Sending your beautiful confirmation email..."}
                {currentStep === 3 && "✨ Finalizing everything..."}
              </p>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">🎉 All done! Redirecting you to your confirmation...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS for sparkle animation */}
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(0.8) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2) rotate(180deg); 
          }
        }
      `}</style>
    </div>
  )
}
