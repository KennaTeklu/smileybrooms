"use client"

import { useEffect, useState } from "react"

interface ScreenReaderAnnouncerProps {
  messages: string[]
  ariaLive?: "polite" | "assertive"
}

export function ScreenReaderAnnouncer({ messages = [], ariaLive = "polite" }: ScreenReaderAnnouncerProps) {
  const [currentMessage, setCurrentMessage] = useState("")

  useEffect(() => {
    if (messages.length === 0) return

    // Set the latest message
    setCurrentMessage(messages[messages.length - 1])

    // Clear the message after it's been read (for polite messages)
    if (ariaLive === "polite") {
      const timer = setTimeout(() => {
        setCurrentMessage("")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [messages, ariaLive])

  return (
    <div className="sr-only" aria-live={ariaLive} aria-atomic="true">
      {currentMessage}
    </div>
  )
}
