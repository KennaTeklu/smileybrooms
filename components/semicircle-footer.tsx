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
  // These radii define the ellipse path for the links
  const linkArcHorizontalRadius = 100 // Controls how wide the link arc is
  const linkArcVerticalRadius = 200 // Controls how tall the link arc is
  const linkArcBaseOffset = 50 // Distance from the left edge of the footer to the leftmost point of the link arc

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 w-[100px] h-full overflow-hidden", // Fixed position, narrow width, full height
        "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800", // Gradient from left to right
        "transition-all duration-500 ease-in-out",
        isExpanded ? "w-[400px]" : "w-[100px]", // Adjust width based on expanded state
        "flex flex-col items-center justify-center", // Center content vertically
      )}
      style={{
        // Makes the entire footer a left-to-right arch (right-half ellipse)
        clipPath: "ellipse(50% 100% at 0% 50%)", // Center at left edge, middle height
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
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400 rotate-90" />{" "}
            {/* Rotate for horizontal collapse */}
          </button>

          {/* Links in a curved row following the semicircle */}
          <div className="relative h-full w-[200px] flex justify-center items-center mt-8">
            {footerLinks.map((link, index) => {
              // Distribute links from -Math.PI/2 to Math.PI/2 (a full right-half ellipse arc)
              const angle = (index / (footerLinks.length - 1)) * Math.PI - Math.PI / 2

              // Calculate x and y positions on the ellipse arc
              const xOffset = linkArcHorizontalRadius * Math.cos(angle)
              const yOffset = linkArcVerticalRadius * Math.sin(angle)

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="absolute flex flex-col items-center gap-1 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-md text-center"
                  onClick={() => setIsExpanded(false)}
                  style={{
                    left: `${linkArcBaseOffset + xOffset}px`, // Position relative to the left of the footer
                    top: `calc(50% + ${yOffset}px)`, // Center vertically
                    transform: "translate(-50%, -50%)", // Center the element on its calculated point
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
        <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-4">
          {" "}
          {/* Position for collapsed button */}
          <button
            onClick={() => setIsExpanded(true)}
            className="group relative flex flex-col items-center gap-2 px-3 py-6 bg-primary/10 hover:bg-primary/20 rounded-full border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105"
            aria-label="Expand footer"
          >
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary [writing-mode:vertical-lr] rotate-180">Explore More</span>{" "}
            {/* Vertical text */}
            <ChevronUp className="h-4 w-4 text-primary group-hover:animate-bounce rotate-90" />{" "}
            {/* Rotate for horizontal expansion */}
          </button>
        </div>
      )}
    </footer>
  )
}
