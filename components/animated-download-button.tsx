"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function AnimatedDownloadButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href="/downloads">
      <motion.button
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-gradient-to-r from-blue-600 to-cyan-500 text-white",
          "overflow-hidden neon-border",
        )}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span animate={isHovered ? { rotate: [0, -10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.5 }}>
          <Download className="h-4 w-4" />
        </motion.span>
        <span>Download App</span>

        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ x: "-100%", opacity: 0.5 }}
          animate={isHovered ? { x: "100%" } : { x: "-100%" }}
          transition={{ duration: 1, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          }}
        />
      </motion.button>
    </Link>
  )
}
