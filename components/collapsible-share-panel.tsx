"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useScrollPosition } from "@/hooks/use-scroll-position.tsx"

interface CollapsibleSharePanelProps {
  children: React.ReactNode
  threshold?: number
}

const CollapsibleSharePanel: React.FC<CollapsibleSharePanelProps> = ({ children, threshold = 200 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const scrollPosition = useScrollPosition()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsCollapsed(scrollPosition > threshold)
  }, [scrollPosition, threshold])

  return (
    <div
      ref={panelRef}
      className={`transition-all duration-300 ease-in-out ${
        isCollapsed
          ? "transform translate-y-full opacity-0 pointer-events-none"
          : "transform translate-y-0 opacity-100 pointer-events-auto"
      } fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50`}
    >
      {children}
    </div>
  )
}

export default CollapsibleSharePanel
