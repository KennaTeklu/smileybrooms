"use client"

import { Button } from "@/components/ui/button"
import type { CartItem } from "@/lib/types"
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react"
import Image from "next/image"

interface CartItemDisplayProps {
  item: CartItem
  onUpdateQuantity: (itemId: string, change: number) => void
  onRemoveItem: (itemId: string, itemName: string) => void
}

export function CartItemDisplay({ item, onUpdateQuantity, onRemoveItem }: CartItemDisplayProps) {
  const formattedPrice = item.unitPrice !== undefined ? `$${item.unitPrice.toFixed(2)}` : "N/A"
  const formattedTotalPrice = item.unitPrice !== undefined ? `$${(item.unitPrice * item.quantity).toFixed(2)}` : "N/A"

  return (
    <div className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item.image || "/placeholder.svg?height=80&width=80&text=Service"}
          alt={item.name}
          fill
          style={{ objectFit: "cover" }}
          className="aspect-square object-cover"
        />
      </div>
      <div className="flex-1 grid gap-1">
        <h4 className="font-medium text-lg">{item.name}</h4>
        <p className="text-muted-foreground text-sm">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdateQuantity(item.id, -1)}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-base w-8 text-center" aria-live="polite" aria-atomic="true">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdateQuantity(item.id, 1)}
              aria-label={`Increase quantity of ${item.name}`}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-right">
            <p className="font-semibold text-base">{formattedTotalPrice}</p>
            {item.quantity > 1 && <p className="text-muted-foreground text-sm">({formattedPrice} each)</p>}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemoveItem(item.id, item.name)}
        className="flex-shrink-0"
        aria-label={`Remove ${item.name} from cart`}
      >
        <Trash2 className="h-5 w-5 text-red-500" />
      </Button>
    </div>
  )
}
