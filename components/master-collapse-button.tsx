"use client"

import { usePanelCollapse } from "@/contexts/panel-collapse-context"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function MasterCollapseButton() {
  const { triggerCollapseAll } = usePanelCollapse()
  const [active, setActive] = useState(false)

  const handleClick = () => {
    triggerCollapseAll()
    setActive(true)
    setTimeout(() => setActive(false), 1500) // visual reset
  }

  // Alt + X keyboard shortcut
  useKeyboardShortcuts({
    "alt+x": handleClick,
  })

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            className="fixed bottom-4 left-4 z-[1001]"
          >
            <Button
              size="icon"
              className={`h-8 w-8 rounded-full p-0 ${
                active ? "bg-green-600" : "bg-gray-800"
              } text-white shadow-md hover:bg-gray-700 focus:outline-none`}
              onClick={handleClick}
              aria-label="Collapse all panels"
            >
              <AnimatePresence>
                {active ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    ✓
                  </motion.span>
                ) : (
                  <X className="h-4 w-4" key="x" />
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>Collapse all panels (Alt&nbsp;+&nbsp;X)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
