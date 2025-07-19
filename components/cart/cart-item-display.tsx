"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2, Minus, Plus } from "lucide-react"
import { motion } from "framer-motion"
import type { CartItem } from "@/lib/cart-context" // Ensure this imports from lib/cart-context

interface CartItemDisplayProps {
  item: CartItem
  onRemoveItem: (itemId: string, itemName: string) => void
  onUpdateQuantity: (itemId: string, change: number) => void
}

export function CartItemDisplay({ item, onRemoveItem, onUpdateQuantity }: CartItemDisplayProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 p-4 border rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
    >
      <Image
        src={item.image || "/placeholder.svg?height=100&width=100"}
        alt={item.name}
        width={80}
        height={80}
        className="rounded-md object-cover border border-gray-200 dark:border-gray-700"
      />
      <div className="flex-1 grid gap-1">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{item.name}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <p className="font-bold text-blue-600 dark:text-blue-400">${item.unitPrice.toFixed(2)}</p>{" "}
        {/* Changed to item.unitPrice */}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="h-8 w-8 rounded-full"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-medium text-lg w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="h-8 w-8 rounded-full"
          aria-label={`Increase quantity of ${item.name}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemoveItem(item.id, item.name)}
        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
        aria-label={`Remove ${item.name} from cart`}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </motion.div>
  )
}
