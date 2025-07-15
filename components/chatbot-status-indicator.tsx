"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface ChatbotStatusIndicatorProps {
  isReady: boolean
}

export default function ChatbotStatusIndicator({ isReady }: ChatbotStatusIndicatorProps) {
  return (
    <motion.div
      className="absolute top-0 left-0 h-full w-full flex items-center justify-center"
      initial={false}
      animate={isReady ? "ready" : "loading"}
      variants={{
        loading: { opacity: 1, scale: 1 },
        ready: { opacity: 0, scale: 0 },
      }}
      transition={{ duration: 0.3 }}
    >
      {!isReady && <Loader2 className="h-6 w-6 animate-spin text-white" />}
    </motion.div>
  )
}
