"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { CartItem } from "@/lib/types"

interface CartItemDisplayProps {
  item: CartItem
  isFullscreen?: boolean
  onRemoveItem?: (id: string, name: string) => void
  onUpdateQuantity?: (id: string, quantity: number) => void
}

export function CartItemDisplay({ item, isFullscreen, onRemoveItem, onUpdateQuantity }: CartItemDisplayProps) {
  const handleQuantityChange = (delta: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, item.quantity + delta)
    }
  }

  const handleRemove = () => {
    if (onRemoveItem) {
      onRemoveItem(item.id, item.name)
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
      <div className="flex-1 pr-2">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatCurrency(item.price)} each
          {item.metadata?.roomConfig?.timeEstimate && ` • ${item.metadata.roomConfig.timeEstimate}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-transparent"
          onClick={() => handleQuantityChange(-1)}
          disabled={item.quantity <= 1}
          aria-label={`Decrease quantity of ${item.name}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-medium text-gray-900 dark:text-gray-100 w-6 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-transparent"
          onClick={() => handleQuantityChange(1)}
          aria-label={`Increase quantity of ${item.name}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="ml-4 text-right">
        <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(item.price * item.quantity)}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
          onClick={handleRemove}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
