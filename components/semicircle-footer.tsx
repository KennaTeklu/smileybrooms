"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Phone,
  ChevronUp,
  Sparkles,
  ChevronDown,
  Book,
  Briefcase,
  ClipboardList,
  DollarSign,
  Calculator,
  Settings,
  Download,
} from "lucide-react"
import Logo from "@/components/logo"
import Link from "next/link"
import { cn } from "@/lib/utils"

const footerLinks = [
  { label: "About", href: "/about", icon: Book },
  { label: "Careers", href: "/careers", icon: Briefcase },
  { label: "Contact", href: "/contact", icon: Phone }, // Using Phone icon for Contact
  { label: "Terms", href: "/terms", icon: ClipboardList },
  { label: "Pricing", href: "/pricing", icon: DollarSign },
  { label: "Calculator", href: "/calculator", icon: Calculator },
  { label: "Tech Stack", href: "/tech-stack", icon: Settings },
  { label: "Download", href: "/download", icon: Download },
]

const socialLinks = [{ icon: Phone, href: "tel:6028000605", label: "Call Us" }]
const PHONE_NUMBER = "(602) 800-0605"

export default function SemicircleFooter() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isExtraCollapsed, setIsExtraCollapsed] = useState(false)
  const currentYear = new Date().getFullYear()
  const lastScrollY = useRef(0)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const scrollDelta = currentScrollY - lastScrollY.current

    // If scrolling down and footer is expanded, collapse it
    if (scrollDelta > 0 && isExpanded) {
      setIsExpanded(false)
    }
    // If scrolling down and footer is collapsed but not extra collapsed, extra collapse it
    else if (scrollDelta > 10 && !isExpanded && !isExtraCollapsed && currentScrollY > 200) {
      setIsExtraCollapsed(true)
    }
    // If scrolling up and footer is extra collapsed, bring it back to normal collapsed
    else if (scrollDelta < -10 && isExtraCollapsed) {
      setIsExtraCollapsed(false)
    }

    lastScrollY.current = currentScrollY
  }, [isExpanded, isExtraCollapsed])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // Constants for positioning links on the arc
  const ARC_RADIUS = 250 // Increased radius for a wider arch
  const START_ANGLE = 170 // Start angle in degrees (closer to 180 for wider spread)
  const END_ANGLE = 10 // End angle in degrees (closer to 0 for wider spread)
  const ANGLE_RANGE = START_ANGLE - END_ANGLE // Total angle range

  const handleExpand = () => {
    setIsExpanded(true)
    setIsExtraCollapsed(false)
  }

  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden",
        "bg-gradient-to-t from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800",
        "transition-all duration-500 ease-in-out",
        isExpanded ? "h-[400px]" : isExtraCollapsed ? "h-[60px]" : "h-[100px]",
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

          {/* Curved Row of Links */}
          <div className="relative w-full h-full flex items-end justify-center">
            {footerLinks.map((link, index) => {
              const angle = START_ANGLE - (index / (footerLinks.length - 1)) * ANGLE_RANGE // Distribute links evenly
              const angleRad = angle * (Math.PI / 180)
              const x = ARC_RADIUS * Math.cos(angleRad)
              const y = ARC_RADIUS * Math.sin(angleRad)
              const Icon = link.icon // Get the Lucide React icon component

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="absolute flex flex-col items-center gap-1 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-md text-center min-w-[80px]"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    bottom: `${y + 20}px`, // Adjust Y to lift it slightly from the very bottom of the arc
                    transform: "translateX(-50%)",
                  }}
                  onClick={() => setIsExpanded(false)}
                >
                  <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" /> {/* Render the icon */}
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {link.label}
                  </span>
                </Link>
              )
            })}

            {/* Center Logo and Copyright */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <Logo className="h-8 w-auto" iconOnly={false} />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                &copy; {currentYear} smileybrooms All rights reserved.
              </div>
            </div>

            {/* Social Links / Phone */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3">
              {socialLinks.map((social) => {
                const SocialIcon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-3 rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <SocialIcon className="h-5 w-5 text-primary" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content for Collapsed State (always visible at the bottom of the semicircle) */}
      {!isExpanded && (
        <div
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 pb-4 transition-all duration-300",
            isExtraCollapsed && "scale-75 opacity-60",
          )}
        >
          <button
            onClick={() => {
              setIsExpanded(true)
              setIsExtraCollapsed(false)
            }}
            className="group relative flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 rounded-full border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105"
            aria-label="Expand footer"
          >
            <Sparkles className={cn("h-4 w-4 text-primary", isExtraCollapsed ? "animate-pulse" : "animate-pulse")} />
            <span className={cn("text-sm font-medium text-primary", isExtraCollapsed && "hidden sm:inline")}>
              {isExtraCollapsed ? "More" : "Explore More"}
            </span>
            <ChevronUp className="h-4 w-4 text-primary group-hover:animate-bounce" />
          </button>
        </div>
      )}
    </footer>
  )
}
