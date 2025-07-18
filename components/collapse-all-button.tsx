"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { usePanelControl } from "@/contexts/panel-control-context"

export function CollapseAllButton() {
  const { collapseAllPanels } = usePanelControl()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={collapseAllPanels}
      className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-transparent"
      aria-label="Collapse all panels"
    >
      <ChevronDown className="h-5 w-5" />
    </Button>
  )
}
