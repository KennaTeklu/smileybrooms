"use client"

import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import { usePanelControl } from "@/contexts/panel-control-context"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function CollapseAllButton() {
  const { collapseAllPanels } = usePanelControl()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000]", // Centered at the bottom
        "md:bottom-8 md:left-auto md:right-8 md:translate-x-0", // Move to bottom-right on larger screens
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={collapseAllPanels}
        className="rounded-full bg-red-600/90 text-white shadow-lg hover:bg-red-700 hover:text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 border-2 border-red-500 w-12 h-12"
        aria-label="Collapse all open panels"
      >
        <XCircle className="h-6 w-6" />
      </Button>
    </motion.div>
  )
}
