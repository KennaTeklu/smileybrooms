"use client" // This page needs to be a client component to manage state for the modal

import { useState } from "react"
import { VoiceCommandButton } from "@/components/voice/voice-command-button"
import PricingContent from "@/components/pricing-content"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel" // Import the modified panel
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRoomContext } from "@/lib/room-context" // To get selected room count for badge
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

export default function PricingPage() {
  const [isAddAllPanelOpen, setIsAddAllPanelOpen] = useState(false)
  const { getSelectedRoomTypes, getTotalPrice } = useRoomContext()
  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()

  return (
    <div className="container mx-auto px-2 py-8 md:px-4 lg:px-6">
      <div className="flex items-center justify-center mb-8 gap-4">
        {" "}
        {/* Added gap for spacing */}
        <h1 className="text-3xl font-bold text-center">Pricing & Services</h1>
        <VoiceCommandButton />
        {/* The "Add All to Cart" button, styled like the chatbot button */}
        <Button
          onClick={() => setIsAddAllPanelOpen(true)}
          className={cn(
            "flex items-center gap-3 py-2 px-4", // Adjusted padding for a more compact button
            "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
            "rounded-xl shadow-lg",
            "hover:bg-blue-50 dark:hover:bg-blue-900/20",
            "border border-blue-200/50 dark:border-blue-800/50",
            "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "text-gray-900 dark:text-gray-100",
          )}
          aria-label="Open add all to cart panel"
        >
          <div className="relative">
            <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded-md backdrop-blur-sm">
              {" "}
              {/* Smaller padding and rounded corners */}
              <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" /> {/* Smaller icon */}
            </div>
            {selectedRoomTypes.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white shadow-lg">
                {" "}
                {/* Smaller badge */}
                {selectedRoomTypes.length}
              </Badge>
            )}
          </div>
          <div className="text-left">
            <div className="text-sm font-bold">Add All to Cart</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(totalPrice)}</div>
          </div>
        </Button>
      </div>

      <PricingContent />

      {/* The CollapsibleAddAllPanel as a controlled modal */}
      <CollapsibleAddAllPanel isOpen={isAddAllPanelOpen} onOpenChange={setIsAddAllPanelOpen} />
    </div>
  )
}
