"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface LiveTimerProps {
  since?: "cleaning_started" | "team_dispatched" | "booking_confirmed"
  startTime?: string
  teamName?: string
  location?: string
  className?: string
}

export function LiveTimer({
  since = "cleaning_started",
  startTime,
  teamName = "The Sparkle Squad",
  location = "Your Location",
  className,
}: LiveTimerProps) {
  const [elapsed, setElapsed] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (startTime) {
      const start = new Date(startTime).getTime()
      setIsActive(true)

      interval = setInterval(() => {
        const now = new Date().getTime()
        const diff = Math.floor((now - start) / 1000)
        setElapsed(diff > 0 ? diff : 0)
      }, 1000)
    } else {
      // Demo mode - simulate active cleaning
      setIsActive(true)
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [startTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  const getStatusMessage = () => {
    switch (since) {
      case "cleaning_started":
        return "Cleaning in progress"
      case "team_dispatched":
        return "Team en route"
      case "booking_confirmed":
        return "Booking confirmed"
      default:
        return "Active"
    }
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={cn("w-3 h-3 rounded-full", isActive ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
            <span className="text-sm font-medium">{getStatusMessage()}</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-lg font-mono font-bold">{formatTime(elapsed)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{teamName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>

        {since === "cleaning_started" && elapsed > 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded-md">
            <p className="text-xs text-green-700">
              Your cleaning is actively in progress. You'll receive updates every 30 minutes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
