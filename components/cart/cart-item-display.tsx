"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Trash2, Plus, Minus, ListChecks, ListX, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn, formatCurrency } from "@/lib/utils"
import { requiresEmailPricing } from "@/lib/room-tiers"
import type { CartItem } from "@/lib/cart/types" // Assuming you have a CartItem type defined

interface CartItemDisplayProps {
  item: CartItem
  onRemoveItem: (itemId: string, itemName: string) => void
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  isFullscreen?: boolean // Optional prop to adjust styling for fullscreen view
}

export function CartItemDisplay({ item, onRemoveItem, onUpdateQuantity, isFullscreen }: CartItemDisplayProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative bg-background rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 items-start sm:items-center",
        isFullscreen && "hover:shadow-lg", // Apply shadow on hover in fullscreen
        "snap-start", // For scroll snapping in collapsible panel
      )}
    >
      {/* Item image */}
      {item.image && (
        <div
          className={cn(
            "flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm",
            isFullscreen && "w-20 h-20 sm:w-24 sm:h-24", // Adjust size for fullscreen
          )}
        >
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            width={isFullscreen ? 96 : 112} // Adjust width based on fullscreen
            height={isFullscreen ? 96 : 112} // Adjust height based on fullscreen
            className="object-cover w-full h-full"
            onError={(e) => {
              // Fallback to local placeholder if remote image fails
              const target = e.target as HTMLImageElement
              if (target && target.src !== "/placeholder.svg") {
                target.src = "/placeholder.svg"
              }
            }}
          />
        </div>
      )}

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-lg leading-tight mb-1 text-gray-900 dark:text-gray-100">{item.name}</h4>
        {item.sourceSection && <p className="text-sm text-muted-foreground mb-2">{item.sourceSection}</p>}
        {item.metadata?.roomConfig?.name && (
          <p className="text-sm text-gray-600 dark:text-gray-400">Tier: {item.metadata.roomConfig.name}</p>
        )}
        {item.metadata?.roomConfig?.timeEstimate && (
          <p className="text-sm text-gray-600 dark:text-gray-400">Est. Time: {item.metadata.roomConfig.timeEstimate}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-base font-medium min-w-[2ch] text-center text-gray-900 dark:text-gray-100">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-right">
            {requiresEmailPricing(item.metadata?.roomType) || item.paymentType === "in_person" ? (
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">Email for Pricing</p>
            ) : (
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(item.price * item.quantity)}
              </p>
            )}
            {item.quantity > 1 &&
              !requiresEmailPricing(item.metadata?.roomType) &&
              item.paymentType !== "in_person" && (
                <p className="text-sm text-muted-foreground">{formatCurrency(item.price)} each</p>
              )}
          </div>
        </div>
      </div>

      {/* Remove button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              onClick={() => onRemoveItem(item.id, item.name)}
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove from cart</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Detailed Breakdown */}
      <Accordion type="multiple" defaultValue={["details"]} className="w-full mt-2">
        <AccordionItem value="details">
          <AccordionTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:no-underline">
            View Service Details
          </AccordionTrigger>
          <AccordionContent className="pt-2 space-y-3">
            {item.metadata?.detailedTasks && item.metadata.detailedTasks.length > 0 && (
              <div>
                <h5 className="flex items-center gap-1 text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                  <ListChecks className="h-4 w-4" /> Included Tasks:
                </h5>
                <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                  {item.metadata.detailedTasks.map((task: string, i: number) => (
                    <li key={i}>{task.replace(/ $$.*?$$/, "")}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.metadata?.notIncludedTasks && item.metadata.notIncludedTasks.length > 0 && (
              <div>
                <h5 className="flex items-center gap-1 text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                  <ListX className="h-4 w-4" /> Not Included:
                </h5>
                <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
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
