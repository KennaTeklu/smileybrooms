"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidePanelContentProps {
  children: React.ReactNode
  className?: string
  preserveScrollPosition?: boolean
  scrollKey?: string
}

export function SidePanelContent({
  children,
  className = "",
  preserveScrollPosition = false,
  scrollKey = "default",
}: SidePanelContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!preserveScrollPosition) return

    const savedPosition = localStorage.getItem(`panel-scroll-${scrollKey}`)
    if (savedPosition && scrollRef.current) {
      scrollRef.current.scrollTop = Number.parseInt(savedPosition, 10)
    }

    return () => {
      if (scrollRef.current) {
        localStorage.setItem(`panel-scroll-${scrollKey}`, scrollRef.current.scrollTop.toString())
      }
    }
  }, [preserveScrollPosition, scrollKey])

  return (
    <div className={`flex-1 overflow-hidden ${className}`}>
      <ScrollArea className="h-full" ref={scrollRef}>
        <div className="p-4 space-y-6">{children}</div>
      </ScrollArea>
    </div>
  )
}
