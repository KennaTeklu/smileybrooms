"use client"

import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import { usePanelControl } from "@/contexts/panel-control-context"
import { motion } from "framer-motion"

export function CollapseAllButton() {
  const { collapseAllPanels } = usePanelControl()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={collapseAllPanels}
        className="rounded-full shadow-lg bg-red-500 text-white hover:bg-red-600 hover:text-white transition-colors duration-200"
        aria-label="Collapse all open panels"
      >
        <XCircle className="h-4 w-4 mr-2" />
        Collapse All
      </Button>
    </motion.div>
  )
}
