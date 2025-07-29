"use client"

import React from "react"

import { motion } from "framer-motion"
import { CheckCircle, Mail, Phone, Clock, Sparkles, Heart, Star } from "lucide-react"
import { useEffect, useState } from "react"

export default function SuccessLoading() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showSparkles, setShowSparkles] = useState(false)

  const steps = [
    {
      icon: CheckCircle,
      title: "Processing Your Request",
      description: "Confirming your service details...",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Mail,
      title: "Sending Beautiful Emails",
      description: "Crafting personalized confirmations...",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Phone,
      title: "Notifying Our Team",
      description: "Your dedicated cleaning team is being alerted...",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Heart,
      title: "Almost Ready!",
      description: "Finalizing your booking experience...",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 1500)

    // Show sparkles after a delay
    const sparkleTimer = setTimeout(() => {
      setShowSparkles(true)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(sparkleTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {showSparkles && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              >
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </motion.div>
            ))}
          </>
        )}
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Main loading card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border border-white/20"
        >
          {/* Logo area */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="h-10 w-10 text-white" />
              </motion.div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmileyBrooms
            </h1>
          </motion.div>

          {/* Current step display */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div
              className={`inline-flex items-center justify-center w-16 h-16 ${steps[currentStep].bgColor} rounded-full mb-4 shadow-lg`}
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                {React.createElement(steps[currentStep].icon, {
                  className: `h-8 w-8 ${steps[currentStep].color}`,
                })}
              </motion.div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{steps[currentStep].title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{steps[currentStep].description}</p>
          </motion.div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: index === currentStep ? 1.2 : 1,
                  boxShadow: index === currentStep ? "0 0 20px rgba(147, 51, 234, 0.5)" : "none",
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* Animated loading dots */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Encouraging message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Almost there!</span>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              We're preparing everything to make your cleaning experience amazing
            </p>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-20"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full opacity-20"
          animate={{
            y: [0, 10, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Bottom message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">✨ Creating your perfect cleaning experience</p>
        <div className="flex items-center justify-center gap-1">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-400">This usually takes just a few seconds</span>
        </div>
      </motion.div>
    </div>
  )
}
