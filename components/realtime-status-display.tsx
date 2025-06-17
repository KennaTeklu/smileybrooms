"use client"

import { useWebSocket } from "@/hooks/use-websocket"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RealtimeStatusDisplay() {
  // In a real app, replace with your actual WebSocket server URL
  const { message, isConnected, error } = useWebSocket("ws://localhost:8080/ws")

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Real-time Service Status</CardTitle>
        <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Live" : "Disconnected"}</Badge>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-sm mb-2" role="alert">
            Error: {error.type || "Unknown WebSocket error"}
          </div>
        )}
        <div className="text-2xl font-bold" aria-live="polite" aria-atomic="true">
          {message ? message.payload.status : "Waiting for updates..."}
        </div>
        {message && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last update: {message.payload.timestamp}</p>
        )}
      </CardContent>
    </Card>
  )
}
