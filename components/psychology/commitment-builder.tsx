"use client"
export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, MapPin, Calendar, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CommitmentBuilderProps {
  onHoldSpot?: () => void
  className?: string
}

export function CommitmentBuilder({ onHoldSpot, className }: CommitmentBuilderProps) {
  const [spotsLeft, setSpotsLeft] = useState(3)
  const [viewingCount, setViewingCount] = useState(12)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [showUrgency, setShowUrgency] = useState(false)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly update viewing count
      if (Math.random() < 0.3) {
        setViewingCount((prev) => Math.max(8, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))))
      }

      // Occasionally decrease spots
      if (Math.random() < 0.1 && spotsLeft > 1) {
        setSpotsLeft((prev) => prev - 1)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [spotsLeft])

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowUrgency(true)
          return 600 // Reset to 10 minutes
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const socialProof = [
    { name: "Sarah M.", time: "2 min ago", action: "booked deep cleaning" },
    { name: "Mike R.", time: "5 min ago", action: "scheduled weekly service" },
    { name: "Lisa K.", time: "8 min ago", action: "added bathroom deep clean" },
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Live Activity Feed */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              <span className="text-sm font-medium">Live Activity</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {viewingCount} people viewing
            </Badge>
          </div>

          <div className="space-y-2">
            {socialProof.map((proof, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center text-sm"
              >
                <Users className="h-3 w-3 text-blue-600 mr-2" />
                <span className="font-medium">{proof.name}</span>
                <span className="text-gray-500 mx-1">•</span>
                <span className="text-gray-600">{proof.action}</span>
                <span className="text-gray-400 ml-auto">{proof.time}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Availability Pressure */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-orange-600 mr-2" />
              <span className="font-medium">Today's Availability</span>
            </div>
            <Badge variant="destructive" className="animate-pulse">
              {spotsLeft} spots left
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 rounded text-center text-xs",
                  index < spotsLeft
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200",
                )}
              >
                {index < spotsLeft ? "Available" : "Booked"}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Clock className="h-4 w-4 inline mr-1 text-orange-600" />
            <span className="text-sm text-orange-700 dark:text-orange-300">
              Hold your spot for {formatTime(timeLeft)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Commitment Action */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <Button
          onClick={onHoldSpot}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg"
        >
          <MapPin className="mr-2 h-5 w-5" />
          Hold My Spot - FREE for 10 Minutes
        </Button>

        <div className="flex items-center justify-center mt-3 text-sm text-gray-500">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span>No payment required • Cancel anytime</span>
        </div>
      </motion.div>

      {/* Urgency Overlay */}
      <AnimatePresence>
        {showUrgency && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowUrgency(false)}
          >
            <Card className="max-w-md mx-4">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-bold mb-2">Time's Up!</h3>
                <p className="text-gray-600 mb-4">Your spot has been released, but we found another opening!</p>
                <Button
                  onClick={() => {
                    setShowUrgency(false)
                    onHoldSpot?.()
                  }}
                  className="w-full"
                >
                  Grab This Spot Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
