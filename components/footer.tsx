"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <footer className="w-full border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center">
          {/* Expandable section toggle */}
          <button
            onClick={toggleExpand}
            className="flex items-center text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2 focus:outline-none"
          >
            <span>More</span>
            {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </button>

          {/* Expandable navigation */}
          <div
            className={cn(
              "grid grid-cols-3 gap-4 w-full max-w-md text-center overflow-hidden transition-all duration-300",
              isExpanded ? "max-h-24 opacity-100 mb-4" : "max-h-0 opacity-0",
            )}
          >
            <Link
              href="/about"
              className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
            >
              Contact
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
            >
              Services
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {currentYear} smileybrooms LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
