"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { motion } from "framer-motion"
import LogoIcon from "./logo-icon"
import { createRoot } from "react-dom/client"

interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export default function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <motion.div
        className="relative flex items-center justify-center h-10 w-10 rounded-full overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Image
          src="/logo-icon.png"
          alt="Smiley Brooms Logo"
          width={40}
          height={40}
          className="object-cover"
          priority
          onError={(e) => {
            // If image fails to load, replace with SVG
            const target = e.target as HTMLImageElement
            target.style.display = "none"
            const container = target.parentElement
            if (container) {
              const svgElement = document.createElement("div")
              container.appendChild(svgElement)
              const root = createRoot(svgElement)
              root.render(<LogoIcon />)
            }
          }}
        />
      </motion.div>

      {!iconOnly && (
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="ml-2 font-bold text-xl"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            SmileyBrooms
          </span>
        </motion.div>
      )}
    </div>
  )
}
