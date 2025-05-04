"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, Home, Info, Phone, Briefcase, Download, Calculator, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import { InteractivePhoneNumber } from "@/components/interactive-phone-number"

type NavItem = {
  name: string
  href: string
  icon: React.ReactNode
  description?: string
}

const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
  { name: "About", href: "/about", icon: <Info className="h-5 w-5" />, description: "Our story and mission" },
  { name: "Contact", href: "/contact", icon: <Phone className="h-5 w-5" />, description: "Get in touch with us" },
  { name: "Careers", href: "/careers", icon: <Briefcase className="h-5 w-5" />, description: "Join our team" },
  { name: "Downloads", href: "/downloads", icon: <Download className="h-5 w-5" />, description: "Get our apps" },
  { name: "Pricing", href: "/pricing", icon: <Calculator className="h-5 w-5" />, description: "Calculate your quote" },
]

export default function EnhancedNavigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      const nextIndex = (index + 1) % navItems.length
      const nextItem = document.getElementById(`nav-item-${nextIndex}`)
      nextItem?.focus()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      const prevIndex = (index - 1 + navItems.length) % navItems.length
      const prevItem = document.getElementById(`nav-item-${prevIndex}`)
      prevItem?.focus()
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || pathname !== "/"
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
      role="banner"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Smiley Brooms home page">
          <Logo className="hover:opacity-90 transition-opacity" />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-1"
          aria-label="Main navigation"
          ref={navRef}
          role="navigation"
        >
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-item-${index}`}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  isActive
                    ? "text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary",
                )}
                aria-current={isActive ? "page" : undefined}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-describedby={item.description ? `nav-desc-${index}` : undefined}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="navigation-underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  />
                )}

                {/* Tooltip */}
                {item.description && (
                  <div
                    id={`nav-desc-${index}`}
                    className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                    role="tooltip"
                  >
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 text-center">
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>
            )
          })}

          {/* Book Now Button */}
          <Button asChild size="sm" className="ml-2 bg-primary hover:bg-primary/90">
            <Link href="/pricing">Book Now</Link>
          </Button>
          <InteractivePhoneNumber phoneNumber="(602) 800-0605" variant="default" />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <Logo className="h-8 w-auto" iconOnly={false} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close navigation menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <nav className="flex-1 overflow-auto py-4" aria-label="Mobile navigation">
                  <ul className="space-y-2 px-2" role="menu">
                    {navItems.map((item, index) => {
                      const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

                      return (
                        <li key={item.href} role="none">
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
                              isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800",
                            )}
                            onClick={() => setIsOpen(false)}
                            role="menuitem"
                            aria-current={isActive ? "page" : undefined}
                          >
                            {item.icon}
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              {item.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {item.description}
                                </div>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4 opacity-50" aria-hidden="true" />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </nav>

                <div className="p-4 border-t">
                  <Button asChild className="w-full">
                    <Link href="/pricing" onClick={() => setIsOpen(false)}>
                      <Calculator className="mr-2 h-4 w-4" aria-hidden="true" />
                      Book Now
                    </Link>
                  </Button>
                  <InteractivePhoneNumber phoneNumber="(602) 800-0605" variant="default" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
