"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Circle } from "lucide-react"

export default function ChatbotStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [responseTime, setResponseTime] = useState<"fast" | "medium" | "slow">("fast")

  useEffect(() => {
    // Simulate checking chatbot service status
    const checkStatus = async () => {
      try {
        const start = Date.now()
        await fetch("https://www.jotform.com/ping", { method: "HEAD" })
        const end = Date.now()
        const time = end - start

        setIsOnline(true)
        if (time < 500) setResponseTime("fast")
        else if (time < 1000) setResponseTime("medium")
        else setResponseTime("slow")
      } catch {
        setIsOnline(false)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    if (!isOnline) return "bg-red-500"
    if (responseTime === "fast") return "bg-green-500"
    if (responseTime === "medium") return "bg-yellow-500"
    return "bg-orange-500"
  }

  const getStatusText = () => {
    if (!isOnline) return "Offline"
    if (responseTime === "fast") return "Online - Fast"
    if (responseTime === "medium") return "Online - Normal"
    return "Online - Slow"
  }

  return (
    <div className="fixed bottom-32 right-4 z-40">
      <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
        <Circle className={`h-2 w-2 mr-1 ${getStatusColor()}`} />
        <span className="text-xs">{getStatusText()}</span>
      </Badge>
    </div>
  )
}
