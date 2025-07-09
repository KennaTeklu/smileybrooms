"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Clock, Users, Star, Heart, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface EmotionalHookProps {
  variant?: "hero" | "calculator" | "checkout"
  className?: string
}

const emotionalMessages = [
  {
    icon: Home,
    title: "Your sanctuary awaits",
    subtitle: "Transform your space into a peaceful haven",
    emotion: "tranquility",
    color: "blue",
  },
  {
    icon: Heart,
    title: "More time for what matters",
    subtitle: "Spend weekends with family, not cleaning",
    emotion: "love",
    color: "pink",
  },
  {
    icon: Sparkles,
    title: "Professional perfection",
    subtitle: "Experience the joy of a spotless home",
    emotion: "satisfaction",
    color: "purple",
  },
  {
    icon: Users,
    title: "Trusted by 10,000+ families",
    subtitle: "Join our community of happy customers",
    emotion: "belonging",
    color: "green",
  },
]

const urgencyTriggers = [
  "🔥 3 spots left today",
  "⏰ Book in next 10 min for same-day service",
  "💎 Premium slots filling fast",
  "🌟 Your favorite team is available now",
]

export function EmotionalHook({ variant = "hero", className }: EmotionalHookProps) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [urgencyIndex, setUrgencyIndex] = useState(0)
  const [showUrgency, setShowUrgency] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % emotionalMessages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Show urgency trigger after 30 seconds
    const urgencyTimer = setTimeout(() => {
      setShowUrgency(true)
      setUrgencyIndex(Math.floor(Math.random() * urgencyTriggers.length))
    }, 30000)

    return () => clearTimeout(urgencyTimer)
  }, [])

  const message = emotionalMessages[currentMessage]
  const Icon = message.icon

  if (variant === "calculator") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("text-center mb-6", className)}
      >
        <div className="flex items-center justify-center mb-3">
          <Icon className={`h-8 w-8 text-${message.color}-600 mr-2`} />
          <h3 className="text-xl font-semibold">{message.title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{message.subtitle}</p>

        <AnimatePresence>
          {showUrgency && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-4"
            >
              <Badge variant="destructive" className="animate-pulse">
                {urgencyTriggers[urgencyIndex]}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  if (variant === "checkout") {
    return (
      <Card className={cn("mb-6 border-l-4 border-l-green-500", className)}>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200">Almost there!</h4>
              <p className="text-sm text-green-600 dark:text-green-300">Your dream clean is just one click away</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("text-center py-12", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center mb-4">
            <Icon className={`h-12 w-12 text-${message.color}-600`} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">{message.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{message.subtitle}</p>

          <div className="flex items-center justify-center space-x-6 mt-8">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">4.9/5 rating</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-1" />
              <span className="text-sm font-medium">Same-day service</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-sm font-medium">10,000+ happy customers</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showUrgency && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <Badge variant="destructive" className="text-lg px-4 py-2 animate-pulse">
              {urgencyTriggers[urgencyIndex]}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
