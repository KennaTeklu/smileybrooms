"use client"

import { useState } from "react"
import { PhoneCall, ChevronUp, Sparkles, ChevronDown } from "lucide-react" // Changed Phone to PhoneCall
import Logo from "@/components/logo"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { COMPANY_PHONE_NUMBER, COMPANY_NAME, COMPANY_COPYRIGHT_YEAR } from "@/lib/constants" // Import constants

const footerLinks = [
  { label: "About", href: "/about", icon: "📖" },
  { label: "Careers", href: "/careers", icon: "💼" },
  { label: "Contact", href: "/contact", icon: "📞" },
  { label: "Terms", href: "/terms", icon: "📋" },
  { label: "Pricing", href: "/pricing", icon: "💰" },
  { label: "Calculator", href: "/calculator", icon: "🧮" },
  { label: "Tech Stack", href: "/tech-stack", icon: "⚙️" },
  { label: "Download", href: "/download", icon: "📱" },
]

const socialLinks = [{ icon: PhoneCall, href: `tel:${COMPANY_PHONE_NUMBER}`, label: "Call Us" }] // Use PhoneCall and constant

export default function SemicircleFooter() {
  const [isExpanded, setIsExpanded] = useState(false)
  // const currentYear = new Date().getFullYear() // Removed, using constant

  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden",
        "bg-gradient-to-t from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800",
        "transition-all duration-500 ease-in-out",
        isExpanded ? "h-[400px]" : "h-[100px]", // Adjust height based on expanded state
        "flex flex-col items-center justify-end",
      )}
      style={{
        clipPath: "ellipse(50% 100% at 50% 100%)", // Makes the entire footer a top-half semicircle
      }}
    >
      {/* Content for Expanded State */}
      {isExpanded && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-8 pb-4 px-4 w-full h-full">
          {/* Collapse Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110"
            aria-label="Collapse footer"
          >
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 w-full max-w-2xl">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-md text-center"
                onClick={() => setIsExpanded(false)}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Logo and Copyright */}
          <div className="flex flex-col items-center gap-2 mt-8">
            <Logo className="h-8 w-auto" iconOnly={false} />
            <div className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {COMPANY_COPYRIGHT_YEAR} {COMPANY_NAME} All rights reserved.
            </div>
          </div>

          {/* Social Links / Phone */}
          <div className="flex gap-3 mt-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="p-3 rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5 text-primary" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Content for Collapsed State (always visible at the bottom of the semicircle) */}
      {!isExpanded && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-4">
          <button
            onClick={() => setIsExpanded(true)}
            className="group relative flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 rounded-full border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105"
            aria-label="Expand footer"
          >
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Explore More</span>
            <ChevronUp className="h-4 w-4 text-primary group-hover:animate-bounce" />
          </button>
        </div>
      )}
    </footer>
  )
}
