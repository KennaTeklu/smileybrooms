"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"
import { SmileyBroomsLogo } from "./smiley-brooms-logo"
import Link from "next/link"

export function SemicircleFooter() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)
  const footerRef = useRef<HTMLDivElement>(null)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    setIsHidden(false) // Always show when toggling manually
  }

  const handleScroll = useCallback(() => {
    if (isExpanded) {
      const currentScrollY = window.scrollY
      if (currentScrollY < lastScrollY.current && currentScrollY > 0) {
        // Scrolling up
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
      lastScrollY.current = currentScrollY
    }
  }, [isExpanded])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // Define the properties for the horizontal arch
  const footerWidth = isExpanded ? 400 : 100 // Expanded width vs collapsed width
  const footerHeight = isExpanded ? 600 : 100 // Expanded height vs collapsed height
  const clipPathValue = `ellipse(50% 100% at 0% 50%)` // Left-side vertical arch

  // Calculate positions for content within the arch
  // These values will need careful tuning based on desired visual
  const linkArcHorizontalRadius = 150 // Controls how wide the arc for links is
  const linkArcVerticalRadius = 250 // Controls how tall the arc for links is
  const linkArcBaseOffset = 100 // Base offset from the left edge of the footer

  const getLinkPosition = (index: number, totalLinks: number) => {
    const angleStep = Math.PI / (totalLinks + 1) // Angle between links
    const angle = angleStep * (index + 1) - Math.PI / 2 // Start from bottom-left of arc

    const x = linkArcBaseOffset + linkArcHorizontalRadius * Math.cos(angle)
    const y = footerHeight / 2 + linkArcVerticalRadius * Math.sin(angle)

    return { left: `${x}px`, top: `${y}px`, transform: "translate(-50%, -50%)" }
  }

  const links = [
    { name: "Services", href: "/pricing" },
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
  ]

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com/smileybrooms" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com/smileybrooms" },
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com/smileybrooms" },
  ]

  return (
    <footer
      ref={footerRef}
      className={`fixed bottom-0 left-0 bg-blue-600 text-white shadow-lg transition-all duration-500 ease-in-out z-[1000]
        ${isExpanded ? "w-[400px] h-[600px]" : "w-[100px] h-[100px]"}
        ${isHidden ? "translate-x-[-100%]" : "translate-x-0"}
        flex flex-col justify-between items-center p-4`}
      style={{ clipPath: clipPathValue }}
    >
      {/* Collapsed State */}
      {!isExpanded && (
        <Button
          onClick={toggleExpanded}
          className="absolute bottom-4 right-4 rounded-full w-16 h-16 flex items-center justify-center bg-white text-blue-600 shadow-md hover:bg-gray-100"
          aria-label="Expand Footer"
        >
          <ChevronUp className="h-8 w-8" />
        </Button>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <>
          <Button
            onClick={toggleExpanded}
            className="absolute top-4 right-4 rounded-full w-10 h-10 flex items-center justify-center bg-white text-blue-600 shadow-md hover:bg-gray-100"
            aria-label="Collapse Footer"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>

          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2">
              <SmileyBroomsLogo className="h-20 w-20 text-white" />
            </div>

            {/* Navigation Links */}
            <nav className="absolute" style={{ top: "200px", left: "50%", transform: "translateX(-50%)" }}>
              <ul
                className="relative"
                style={{ width: `${linkArcHorizontalRadius * 2}px`, height: `${linkArcVerticalRadius * 2}px` }}
              >
                {links.map((link, index) => (
                  <li
                    key={link.name}
                    className="absolute text-center"
                    style={{
                      ...getLinkPosition(index, links.length),
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Link href={link.href} className="text-white hover:underline text-lg font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact Info */}
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2 text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5" />
                <a href="tel:6028000605" className="hover:underline">
                  (602) 800-0605
                </a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                <a href="mailto:info@smileybrooms.com" className="hover:underline">
                  info@smileybrooms.com
                </a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Phoenix, AZ</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-200">
              &copy; 2025 smileybrooms.com All rights reserved.
            </div>
          </div>
        </>
      )}
    </footer>
  )
}
