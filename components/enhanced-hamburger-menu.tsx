"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HamburgerMenuProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export function HamburgerMenu({ isOpen, onToggle, className }: HamburgerMenuProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className={cn(
        "relative w-10 h-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        className,
      )}
    >
      <div className="w-6 h-6 relative flex flex-col justify-center items-center">
        <motion.span
          className="block absolute h-0.5 w-6 bg-current rounded-full"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : -6,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="block absolute h-0.5 w-6 bg-current rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? -10 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="block absolute h-0.5 w-6 bg-current rounded-full"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 0 : 6,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
      <span className="sr-only">{isOpen ? "Close navigation menu" : "Open navigation menu"}</span>
    </Button>
  )
}
