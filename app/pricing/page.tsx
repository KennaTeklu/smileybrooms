"use client" // This page needs to be a client component to manage state for the modal

import { useState } from "react"
import { VoiceCommandButton } from "@/components/voice/voice-command-button"
import { PricingContent } from "@/components/pricing-content"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel" // Import the modified panel
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react" // Added ShoppingCart for the button
import { cn } from "@/lib/utils"
import { useRoom } from "@/lib/room-context" // Changed import from useRoomContext to useRoom
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
  const [isAddAllPanelOpen, setIsAddAllPanelOpen] = useState(false)
  const { roomState, getTotalPrice } = useRoom() // Changed from useRoomContext to useRoom
  const selectedRoomTypes = Object.keys(roomState.roomConfigs).filter(
    (roomType) => roomState.roomConfigs[roomType].basePrice > 0 || roomState.roomConfigs[roomType].isPriceTBD,
  )
  const totalPrice = getTotalPrice()

  return (
    <div className="container mx-auto px-2 py-8 md:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 leading-tight">
          Flexible Pricing & Services
        </h1>
        <VoiceCommandButton />
        {/* The "Add All to Cart" button, now more integrated */}
        <Button
          onClick={() => setIsAddAllPanelOpen(true)}
          className={cn(
            "flex items-center gap-2 py-2 px-4",
            "bg-blue-600 text-white rounded-lg shadow-md",
            "hover:bg-blue-700 transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "relative", // For badge positioning
          )}
          aria-label="Open add all to cart panel"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-semibold">Add All to Cart</span>
          {selectedRoomTypes.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white shadow-lg">
              {selectedRoomTypes.length}
            </Badge>
          )}
        </Button>
      </div>

      <PricingContent />

      {/* The CollapsibleAddAllPanel as a controlled modal */}
      <CollapsibleAddAllPanel isOpen={isAddAllPanelOpen} onOpenChange={setIsAddAllPanelOpen} />
    </div>
  )
}
