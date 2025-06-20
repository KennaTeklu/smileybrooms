"use client"

import { useState, useEffect } from "react"
import {
  Phone,
  ChevronUp,
  Sparkles,
  ChevronDown,
  BookOpen,
  Briefcase,
  ClipboardList,
  DollarSign,
  Settings,
  Download,
  Calculator,
} from "lucide-react"
import Logo from "@/components/logo"
import Link from "next/link"
import { cn } from "@/lib/utils"

const footerLinks = [
  { label: "About", href: "/about", icon: BookOpen },
  { label: "Careers", href: "/careers", icon: Briefcase },
  { label: "Contact", href: "/contact", icon: Phone },
  { label: "Terms", href: "/terms", icon: ClipboardList },
  { label: "Pricing", href: "/pricing", icon: DollarSign },
  { label: "Calculator", href: "/calculator", icon: Calculator },
  { label: "Tech Stack", href: "/tech-stack", icon: Settings },
  { label: "Download", href: "/download", icon: Download },
]

const companyPhoneNumber = "6028000605"
const socialLinks = [{ icon: Phone, href: `tel:${companyPhoneNumber}`, label: "Call Us" }]

export default function SemicircleFooter() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const currentYear = new Date().getFullYear()

  // Handle scroll to hide footer
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Only collapse if scrolling up significantly and not at the very bottom
      if (
        isExpanded &&
        currentScrollY < lastScrollY &&
        currentScrollY < document.documentElement.scrollHeight - window.innerHeight - 100
      ) {
        setIsExpanded(false)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isExpanded, lastScrollY])

  // Parameters for the curved link arrangement
  const arcRadius = 150 // Radius of the arc on which links will be placed
  const arcBottomOffset = 80 // Distance from the very bottom of the footer to the center of the arc

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
      role="contentinfo"
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

          {/* Links in a curved row */}
          <div className="relative w-full h-[200px] flex justify-center items-center mt-8">
            {footerLinks.map((link, index) => {
              // Distribute links from -90 to 90 degrees (a full semicircle arc)
              const angle = (index / (footerLinks.length - 1)) * 180 - 90
              const angleRad = angle * (Math.PI / 180)

              // Calculate x and y positions on the arc
              const xOffset = arcRadius * Math.cos(angleRad)
              const yOffset = arcRadius * Math.sin(angleRad)

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="absolute flex flex-col items-center gap-1 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-md text-center"
                  onClick={() => setIsExpanded(false)}
                  style={{
                    left: `calc(50% + ${xOffset}px)`,
                    bottom: `${arcBottomOffset + yOffset}px`, // Position relative to the bottom of the footer
                    transform: "translate(-50%, 50%)", // Center the element on its calculated point
                  }}
                >
                  <link.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Logo and Copyright */}
          <div className="flex flex-col items-center gap-2 mt-auto mb-4">
            <Logo className="h-8 w-auto" iconOnly={false} />
            <div className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {currentYear} smileybrooms.com All rights reserved.
            </div>
          </div>

          {/* Social Links / Phone */}
          <div className="flex gap-3 mb-4">
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
