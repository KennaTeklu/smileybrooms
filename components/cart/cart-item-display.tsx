"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Minus, PlusIcon, Trash2, ListChecks, ListX, Lightbulb } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { CartItem } from "@/lib/cart/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

interface CartItemDisplayProps {
  item: CartItem
  isFullscreen?: boolean
  isSelected?: boolean
  onRemoveItem: (itemId: string, itemName: string) => void
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
}

export function CartItemDisplay({
  item,
  isFullscreen,
  isSelected,
  onRemoveItem,
  onUpdateQuantity,
}: CartItemDisplayProps) {
  const isCustomOrInPerson = item.paymentType === "in_person" || item.id.startsWith("custom-cleaning-other-custom-")

  const displayPrice = isCustomOrInPerson ? "Email for Pricing" : formatCurrency(item.price)
  const displayItemTotal = isCustomOrInPerson ? "Email for Pricing" : formatCurrency(item.price * item.quantity)

  return (
    <motion.div
      layout // Enable layout animations
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }} // Animate out to the left
      transition={{ duration: 0.3 }}
      className={`flex flex-col gap-3 p-4 rounded-xl group transition-all duration-300 border hover:shadow-lg ${
        isSelected
          ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-300 dark:border-blue-600"
          : "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{item.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {item.metadata?.roomConfig?.name || "Custom Tier"}
          </p>
          <Badge variant="outline" className="text-xs mt-2">
            {displayPrice} per unit
          </Badge>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="font-bold text-xl text-blue-600 dark:text-blue-400">{displayItemTotal}</div>
          <div className="flex items-center justify-end space-x-2 mt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onUpdateQuantity(item.id, -1)
              }}
              disabled={item.quantity <= 1}
              className="h-7 w-7"
              aria-label={`Decrease ${item.name} quantity`}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Minus className="h-3 w-3" />
              </motion.div>
            </Button>
            <span className="w-6 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onUpdateQuantity(item.id, 1)
              }}
              className="h-7 w-7"
              aria-label={`Increase ${item.name} quantity`}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PlusIcon className="h-3 w-3" />
              </motion.div>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveItem(item.id, item.name)
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-0 h-8 w-8 p-0 opacity-70 group-hover:opacity-100 rounded-full"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove from cart</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full mt-2">
        <AccordionItem value="details">
          <AccordionTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:no-underline">
            View Details
          </AccordionTrigger>
          <AccordionContent className="pt-2 space-y-3">
            {item.metadata?.detailedTasks && item.metadata.detailedTasks.length > 0 && (
              <div>
                <h5 className="flex items-center gap-1 text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                  <ListChecks className="h-4 w-4" /> Included Tasks:
                </h5>
                <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5 max-h-[100px] overflow-y-auto pr-2">
                  {item.metadata.detailedTasks.map((task: string, i: number) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.metadata?.notIncludedTasks && item.metadata.notIncludedTasks.length > 0 && (
              <div>
                <h5 className="flex items-center gap-1 text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                  <ListX className="h-4 w-4" /> Not Included:
                </h5>
                <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5 max-h-[100px] overflow-y-auto pr-2">
                  {item.metadata.notIncludedTasks.map((task: string, i: number) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.metadata?.upsellMessage && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800 dark:text-yellow-300">{item.metadata.upsellMessage}</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  )
}
