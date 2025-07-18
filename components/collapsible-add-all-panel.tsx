"use client"

import { useMemo } from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion" // Ensure AnimatePresence is imported
import { X, CheckCircle, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useClickOutside } from "@/hooks/use-click-outside"
import { cn } from "@/lib/utils"
import { usePanelControl } from "@/contexts/panel-control-context"
import { useRoom } from "@/lib/room-context"
import { useToast } from "@/components/ui/use-toast"

interface CollapsibleAddAllPanelProps {
  roomType: string
}

export function CollapsibleAddAllPanel({ roomType }: CollapsibleAddAllPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { addRoom, getRoomQuantity, roomConfigs } = useRoom()
  const { vibrate } = useVibration()
  const { toast } = useToast()

  const { registerPanel, unregisterPanel } = usePanelControl()

  const allTiersAdded = useMemo(() => {
    const tiers = roomConfigs[roomType] || []
    return tiers.every((tier) => getRoomQuantity(roomType, tier.id) > 0)
  }, [roomConfigs, roomType, getRoomQuantity])

  useEffect(() => {
    registerPanel(`add-all-panel-${roomType}`, setIsOpen)
    return () => unregisterPanel(`add-all-panel-${roomType}`)
  }, [registerPanel, unregisterPanel, roomType])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return
    }
    setIsOpen(false)
  })

  useKeyboardShortcuts({
    "alt+a": () => setIsOpen((prev) => !prev),
    Escape: () => setIsOpen(false),
  })

  const handleAddAll = useCallback(() => {
    const tiers = roomConfigs[roomType] || []
    let addedCount = 0
    tiers.forEach((tier) => {
      if (getRoomQuantity(roomType, tier.id) === 0) {
        addRoom(roomType, tier.id)
        addedCount++
      }
    })
    if (addedCount > 0) {
      vibrate(100)
      toast({
        title: "Rooms Added!",
        description: `All available ${roomType} tiers have been added to your selection.`,
        variant: "default",
      })
    } else {
      toast({
        title: "No New Rooms to Add",
        description: `All ${roomType} tiers are already in your selection.`,
        variant: "info",
      })
    }
    setIsOpen(false)
  }, [roomConfigs, roomType, getRoomQuantity, addRoom, vibrate, toast])

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative mt-6" ref={panelRef}>
      <Button
        ref={buttonRef}
        variant="outline"
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-200",
          "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40",
          "text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          allTiersAdded && "opacity-60 cursor-not-allowed",
        )}
        onClick={() => setIsOpen(!isOpen)}
        disabled={allTiersAdded}
        aria-label={allTiersAdded ? `All ${roomType} tiers added` : `Add all ${roomType} tiers`}
      >
        {allTiersAdded ? (
          <>
            <CheckCircle className="h-5 w-5" />
            <span>All {roomType} tiers added</span>
          </>
        ) : (
          <>
            <PlusCircle className="h-5 w-5" />
            <span>Add All {roomType} Tiers</span>
          </>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-10"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Confirm Action</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close confirmation"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to add all available tiers for {roomType} to your selection?
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddAll}>
                Add All
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
