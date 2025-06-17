"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface WebSocketMessage {
  type: string
  payload: any
}

export function useWebSocket(url: string) {
  const [message, setMessage] = useState<WebSocketMessage | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Event | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return // Already connected or connecting
    }

    // Simulate WebSocket connection
    console.log(`Simulating WebSocket connection to ${url}...`)
    setIsConnected(true)
    setError(null)

    // Simulate receiving messages
    let messageCounter = 0
    const interval = setInterval(() => {
      messageCounter++
      const simulatedMessage: WebSocketMessage = {
        type: "status_update",
        payload: {
          timestamp: new Date().toLocaleTimeString(),
          status: `Service update #${messageCounter}: Your cleaning is ${messageCounter % 2 === 0 ? "in progress" : "almost complete"}!`,
        },
      }
      setMessage(simulatedMessage)
    }, 5000) // Simulate a message every 5 seconds

    // In a real scenario, you'd have:
    // wsRef.current = new WebSocket(url);
    // wsRef.current.onopen = () => setIsConnected(true);
    // wsRef.current.onmessage = (event) => setMessage(JSON.parse(event.data));
    // wsRef.current.onerror = (event) => setError(event);
    // wsRef.current.onclose = () => {
    //   setIsConnected(false);
    //   // Implement reconnect logic here
    //   reconnectTimeoutRef.current = setTimeout(connect, 3000);
    // };

    return () => {
      clearInterval(interval) // Clear simulation interval
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      // In a real scenario: wsRef.current?.close();
      console.log("Simulated WebSocket disconnected.")
    }
  }, [url])

  useEffect(() => {
    const cleanup = connect()
    return () => cleanup?.()
  }, [connect])

  return { message, isConnected, error }
}
