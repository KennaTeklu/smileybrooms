"use client"

import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { usePanelVisibility } from "@/contexts/panel-visibility-context"
import { cn } from "@/lib/utils"

export function PanelToggleButton() {
  const { arePanelsVisible, togglePanelsVisibility } = usePanelVisibility()

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed bottom-4 left-4 z-50 rounded-full shadow-lg transition-all duration-200",
        "bg-gray-800/90 text-white hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
        "hover:-translate-y-1 hover:shadow-xl active:translate-y-0 border-2 border-gray-500",
      )}
      onClick={togglePanelsVisibility}
      aria-label={arePanelsVisible ? "Hide panels" : "Show panels"}
    >
      {arePanelsVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </Button>
  )
}
