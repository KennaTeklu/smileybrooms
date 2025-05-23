"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Facebook, Instagram, Twitter, ChevronUp, ChevronDown } from "lucide-react"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"

type FooterSection = {
  title: string
  links: {
    label: string
    href: string
    external?: boolean
  }[]
}

const footerSections: FooterSection[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Home Cleaning", href: "/services/home" },
      { label: "Office Cleaning", href: "/services/office" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
]

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [flashEffect, setFlashEffect] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleToggle = () => {
    if (isExpanded) {
      // When closing, trigger the flash effect
      setFlashEffect(true)
      setTimeout(() => {
        setFlashEffect(false)
      }, 100) // Brief flash
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <footer
      className={cn(
        "relative bg-gray-50 dark:bg-gray-900 py-6 overflow-hidden",
        flashEffect && "after:absolute after:inset-0 after:bg-white after:opacity-30 after:z-10 after:animate-flash",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Logo and Toggle Button */}
          <div className="flex items-center justify-center w-full">
            <Logo className="h-8 w-auto" />
            <button
              onClick={handleToggle}
              className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse footer" : "Expand footer"}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="w-full overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                  {footerSections.map((section) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.links.map((link) => (
                          <motion.li key={link.label} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                            <a
                              href={link.href}
                              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center"
                              target={link.external ? "_blank" : undefined}
                              rel={link.external ? "noopener noreferrer" : undefined}
                            >
                              {link.label}
                            </a>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex justify-center space-x-4 py-4"
                >
                  <a
                    href="#"
                    className="rounded-full bg-gray-200 dark:bg-gray-800 p-2 hover:bg-primary hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="rounded-full bg-gray-200 dark:bg-gray-800 p-2 hover:bg-primary hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="rounded-full bg-gray-200 dark:bg-gray-800 p-2 hover:bg-primary hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </motion.div>

                {/* App Download Links - Simplified */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-4 py-4"
                >
                  <a href="/pricing" className="text-xs text-gray-500 hover:text-primary transition-colors">
                    iOS App
                  </a>
                  <a href="/pricing" className="text-xs text-gray-500 hover:text-primary transition-colors">
                    Android App
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Copyright - Always visible */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Smiley Brooms. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
