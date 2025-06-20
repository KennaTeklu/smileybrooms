"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, X, ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface CollapsibleAddAllPanelProps {
  isOpen: boolean
  onClose: () => void
  onAddAll: () => void
  totalRooms: number
  totalPrice: number
  dynamicTop: number // New prop for dynamic positioning
  setPanelHeight: (height: number) => void // Callback to report height
}

export function CollapsibleAddAllPanel({
  isOpen,
  onClose,
  onAddAll,
  totalRooms,
  totalPrice,
  dynamicTop,
  setPanelHeight,
}: CollapsibleAddAllPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.offsetHeight)
    }
  }, [isOpen, setPanelHeight]) // Recalculate height when open state changes

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className="fixed right-4 z-[997] transition-all duration-300 ease-in-out"
      style={{ top: `${dynamicTop}px` }}
    >
      <Card className="w-80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> Add All to Cart
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            You have selected <span className="font-semibold">{totalRooms} room(s)</span> for a total estimated price of{" "}
            <span className="font-semibold">{formatCurrency(totalPrice)}</span>.
          </p>
          <Separator />
          <Button onClick={onAddAll} className="w-full flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" /> Add All Selected Rooms
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
