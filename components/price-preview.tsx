"use client"

import { motion, AnimatePresence } from "framer-motion"
import { formatCurrency } from "@/lib/utils"

interface PricePreviewProps {
  price: number
  paymentFrequency?: "per_service" | "monthly" | "yearly"
  size?: "default" | "large"
  animate?: boolean
}

export function PricePreview({
  price,
  paymentFrequency = "per_service",
  size = "default",
  animate = false,
}: PricePreviewProps) {
  const fontSize = size === "large" ? "text-3xl" : "text-2xl"

  return (
    <div className="flex items-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={`${price}-${paymentFrequency}`}
          initial={animate ? { opacity: 0, y: -10 } : undefined}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          exit={animate ? { opacity: 0, y: 10 } : undefined}
          className={`font-bold text-primary ${fontSize}`}
        >
          {formatCurrency(price)}
        </motion.span>
      </AnimatePresence>

      {paymentFrequency !== "per_service" && (
        <span className="text-sm text-gray-500 ml-1">/{paymentFrequency === "monthly" ? "month" : "year"}</span>
      )}
    </div>
  )
}
