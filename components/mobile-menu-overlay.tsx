"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Info, Calculator, Phone, Briefcase, Settings, User, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileMenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  { name: "Home", href: "/", icon: Home, primary: true },
  { name: "About", href: "/about", icon: Info, primary: true },
  { name: "Calculator", href: "/calculator", icon: Calculator, primary: true },
  { name: "Contact", href: "/contact", icon: Phone, primary: true },
  { name: "Careers", href: "/careers", icon: Briefcase, primary: false },
  { name: "Tech Stack", href: "/tech-stack", icon: Settings, primary: false },
]

const overlayVariants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
}

const menuVariants = {
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
}

export function MobileMenuOverlay({ isOpen, onClose }: MobileMenuOverlayProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu Content */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">SmileyBrooms</h2>
                    <p className="text-blue-100 text-sm">Professional Cleaning</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                    ×
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <motion.nav className="p-6 space-y-2" variants={menuVariants} initial="closed" animate="open">
                {/* Primary Navigation */}
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Main Menu
                  </h3>
                  {navigationItems
                    .filter((item) => item.primary)
                    .map((item) => (
                      <motion.div key={item.name} variants={itemVariants}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                            "hover:bg-gray-100 dark:hover:bg-gray-800",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500",
                            pathname === item.href
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300",
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                          {pathname === item.href && (
                            <motion.div
                              className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                              layoutId="activeIndicator"
                            />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                </div>

                {/* Secondary Navigation */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    More
                  </h3>
                  {navigationItems
                    .filter((item) => !item.primary)
                    .map((item) => (
                      <motion.div key={item.name} variants={itemVariants}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                            "hover:bg-gray-100 dark:hover:bg-gray-800",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500",
                            pathname === item.href
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300",
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div className="pt-4 border-t border-gray-200 dark:border-gray-700" variants={itemVariants}>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={onClose}>
                      <ShoppingCart className="w-4 h-4" />
                      Cart
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={onClose}>
                      <User className="w-4 h-4" />
                      Account
                    </Button>
                  </div>
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
