"use client"

import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"

interface PricePreviewProps {
  price: number
  paymentFrequency?: string
  size?: "small" | "medium" | "large"
  animate?: boolean
}

export function PricePreview({
  price,
  paymentFrequency = "per_service",
  size = "medium",
  animate = false,
}: PricePreviewProps) {
  const fontSizeClass = size === "small" ? "text-lg" : size === "large" ? "text-3xl" : "text-2xl"

  const frequencyLabel = paymentFrequency === "monthly" ? "/month" : paymentFrequency === "yearly" ? "/year" : ""

  return (
    <div className="flex items-baseline">
      {animate ? (
        <motion.span
          key={price}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-bold ${fontSizeClass} text-primary`}
        >
          {formatCurrency(price)}
        </motion.span>
      ) : (
        <span className={`font-bold ${fontSizeClass} text-primary`}>{formatCurrency(price)}</span>
      )}
      {frequencyLabel && <span className="text-sm text-gray-500 ml-1">{frequencyLabel}</span>}
    </div>
  )
}
