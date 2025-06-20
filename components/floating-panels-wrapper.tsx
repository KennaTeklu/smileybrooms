"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion" // Using framer-motion for smooth transitions
import { cn } from "@/lib/utils"

// Define panel configuration and order from right to left (closest to right edge first)
const PANEL_CONFIG = [
  { id: "cart", collapsedWidth: 48, expandedWidth: 320 },
  { id: "addAll", collapsedWidth: 48, expandedWidth: 320 },
  { id: "share", collapsedWidth: 48, expandedWidth: 320 },
  { id: "settings", collapsedWidth: 48, expandedWidth: 320 },
  { id: "chatbot", collapsedWidth: 48, expandedWidth: 320 },
]

const PANEL_SPACING = 12 // Space between panels

type FloatingPanelWrapperProps = {
  id: string
  isExpanded: boolean
  onToggle: (id: string) => void
  panelRightOffset: number
  children: React.ReactNode
  className?: string
}

// This is a generic wrapper for each collapsible panel to receive props
export function FloatingPanelWrapper({
  id,
  isExpanded,
  onToggle,
  panelRightOffset,
  children,
  className,
}: FloatingPanelWrapperProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Handle click outside to collapse panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded) {
        onToggle(id) // Toggle to collapse
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, onToggle, id])

  const config = PANEL_CONFIG.find((p) => p.id === id)
  const currentWidth = config ? (isExpanded ? config.expandedWidth : config.collapsedWidth) : 48 // Default to 48 if not found

  return (
    <motion.div
      ref={panelRef}
      key={id}
      initial={false} // Disable initial animation on mount
      animate={{
        right: panelRightOffset,
        width: currentWidth,
        opacity: 1,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={cn("fixed top-20 z-[998] flex", className)} // top-20 to avoid header
      style={{
        height: "auto", // Let child determine height
        minHeight: "48px", // Minimum height for collapsed state
      }}
    >
      {/* Render the actual panel content, passing down the isExpanded and onToggle */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isExpanded: isExpanded,
            onToggle: onToggle, // Pass the toggle function from the wrapper
            // Do not pass panelRightOffset directly to child, as it's handled by this wrapper's style
          })
        }
        return child
      })}
    </motion.div>
  )
}

export default function FloatingPanelsWrapper({ children }: { children: React.ReactNode }) {
  const [activePanelId, setActivePanelId] = useState<string | null>(null)

  const handleToggle = useCallback((id: string) => {
    setActivePanelId((prevId) => (prevId === id ? null : id))
  }, [])

  // Collect children and their IDs
  const panels = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => ({
      id: (child.props as any).id, // Assuming each panel component has an 'id' prop
      component: child,
    }))

  // Calculate dynamic right offsets for each panel
  const getPanelRightOffset = useCallback(
    (panelId: string) => {
      let currentRight = 0
      let offset = 0

      // Iterate through panels from right to left (as defined in PANEL_CONFIG)
      for (const config of PANEL_CONFIG) {
        // Only consider panels that are actually rendered as children
        if (!panels.some((p) => p.id === config.id)) {
          continue
        }

        if (config.id === activePanelId) {
          // If this is the active panel, it takes its expanded width
          offset = currentRight
          currentRight += config.expandedWidth + PANEL_SPACING
        } else {
          // Other panels take their collapsed width
          offset = currentRight
          currentRight += config.collapsedWidth + PANEL_SPACING
        }

        if (config.id === panelId) {
          return offset
        }
      }
      return 0 // Should not happen if panelId is valid
    },
    [activePanelId, panels],
  )

  return (
    <>
      {panels.map((panel) => (
        <FloatingPanelWrapper
          key={panel.id}
          id={panel.id}
          isExpanded={panel.id === activePanelId}
          onToggle={handleToggle}
          panelRightOffset={getPanelRightOffset(panel.id)}
        >
          {panel.component}
        </FloatingPanelWrapper>
      ))}
    </>
  )
}
