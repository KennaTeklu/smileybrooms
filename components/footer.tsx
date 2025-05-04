"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Facebook, Instagram, Twitter, ChevronUp, ChevronDown } from "lucide-react"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import Link from "next/link"

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
  {
    title: "Pricing",
    links: [{ label: "Get a Quote", href: "/pricing" }],
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {footerSections.map((section, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{section.title}</h3>
                    <ul className="flex flex-col gap-2">
                      {section.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Copyright and Social Links */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              &copy; {currentYear} Your Company. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
