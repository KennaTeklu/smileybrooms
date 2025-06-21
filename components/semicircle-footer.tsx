"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart, Shield, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
]

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
]

const trustBadges = [
  { icon: Shield, text: "Insured & Bonded" },
  { icon: Award, text: "5-Star Rated" },
  { icon: Clock, text: "24/7 Support" },
]

export default function SemicircleFooter() {
  const pathname = usePathname()
  const [scrollState, setScrollState] = useState<"normal" | "collapsed" | "hidden">("normal")

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Calculate scroll percentage
      const scrollPercentage = scrollY / (documentHeight - windowHeight)

      if (scrollPercentage > 0.8) {
        setScrollState("hidden")
      } else if (scrollPercentage > 0.3) {
        setScrollState("collapsed")
      } else {
        setScrollState("normal")
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hide footer completely on homepage
  if (pathname === "/") {
    return null
  }

  return (
    <footer
      className={cn(
        "relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
        "border-t border-border/50 transition-all duration-500 ease-in-out",
        scrollState === "hidden" && "transform translate-y-full opacity-0",
        scrollState === "collapsed" && "transform scale-95 opacity-75",
        scrollState === "normal" && "transform scale-100 opacity-100",
      )}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Semicircle Design Element */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-12 bg-gradient-to-t from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-t-full border-t border-l border-r border-border/30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className={cn("transition-all duration-300 ease-in-out", scrollState === "collapsed" ? "py-6" : "py-12")}>
          <div
            className={cn(
              "grid gap-8 transition-all duration-300",
              scrollState === "collapsed"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
            )}
          >
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SmileyBrooms
                </h3>
              </div>
              <p
                className={cn(
                  "text-muted-foreground transition-all duration-300",
                  scrollState === "collapsed" ? "text-sm" : "text-base",
                )}
              >
                Professional cleaning services that bring joy to your home. We're committed to excellence and customer
                satisfaction.
              </p>

              {/* Trust Badges */}
              <div
                className={cn(
                  "flex flex-wrap gap-2 transition-all duration-300",
                  scrollState === "collapsed" && "hidden md:flex",
                )}
              >
                {trustBadges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1 text-xs">
                    <badge.icon className="w-3 h-3" />
                    <span>{badge.text}</span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div
              className={cn("space-y-4 transition-all duration-300", scrollState === "collapsed" && "hidden lg:block")}
            >
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Links</h4>
              <nav className="flex flex-col space-y-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>hello@smileybrooms.com</span>
                </div>
                <div
                  className={cn(
                    "flex items-center space-x-3 text-sm text-muted-foreground transition-all duration-300",
                    scrollState === "collapsed" && "hidden",
                  )}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Serving Greater Metro Area</span>
                </div>
              </div>
            </div>

            {/* Social Links & CTA */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="sm"
                    className="w-9 h-9 p-0 rounded-full hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
                    asChild
                  >
                    <Link href={social.href} aria-label={social.label}>
                      <social.icon className="w-4 h-4" />
                    </Link>
                  </Button>
                ))}
              </div>

              {scrollState === "normal" && (
                <div className="pt-2">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Book Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={cn(
            "border-t border-border/30 transition-all duration-300",
            scrollState === "collapsed" ? "py-3" : "py-6",
          )}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p
              className={cn(
                "text-muted-foreground transition-all duration-300",
                scrollState === "collapsed" ? "text-xs" : "text-sm",
              )}
            >
              © 2024 SmileyBrooms. All rights reserved.
            </p>
            <div
              className={cn(
                "flex items-center space-x-4 text-muted-foreground transition-all duration-300",
                scrollState === "collapsed" ? "text-xs" : "text-sm",
              )}
            >
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for clean homes</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
