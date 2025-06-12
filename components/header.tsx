"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Download, Calculator, Users, Mail, Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo" // Re-imported Logo component
import { cn } from "@/lib/utils"
import CartButton from "@/components/cart-button" // Ensure CartButton is imported

// Define navigation structure - REMOVED ALL CART LINKS
const navigationLinks = [
  { href: "/pricing", label: "Pricing", icon: Calculator },
  { href: "/about", label: "About", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/accessibility", label: "Accessibility", icon: Accessibility },
]

// Essential links that should always be visible
const essentialLinks = [
  { href: "/pricing", label: "Pricing", icon: Calculator },
  { href: "/about", label: "About", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
]

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [shouldRender, setShouldRender] = useState(pathname !== "/")
  // Removed cartItemCount state as CartButton handles its own state via context

  useEffect(() => {
    setShouldRender(pathname !== "/")
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      setIsScrolled(scrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // Filter out current page from navigation
  const getVisibleLinks = () => {
    // Always show essential links except current page
    const filteredLinks = navigationLinks.filter((link) => link.href !== pathname)
    return filteredLinks.slice(0, 4) // Limit to 4 links for clean UI
  }

  const visibleLinks = getVisibleLinks()

  if (!shouldRender) {
    return null
  }

  return (
    <header
      id="main-header" // Add this ID
      className={cn(
        "sticky-header transition-all duration-300",
        isScrolled ? "bg-white/95 dark:bg-gray-950/95 shadow-sm" : "bg-white/90 dark:bg-gray-950/90",
      )}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1001,
        height: "64px", // 1.69cm
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/* Using the Logo component */}
          <Logo className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          {/* Dynamic navigation links for larger screens */}
          <nav className="hidden lg:flex items-center gap-4">
            {visibleLinks.map((link) => {
              const IconComponent = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <IconComponent className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Single Cart Button - Using the CartButton component */}
          <CartButton showLabel={true} />

          {/* Download button for desktop */}
          <div className="hidden md:block">
            <Button variant="outline" size="sm" asChild>
              <Link href="/download" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden lg:inline">Download</span>
              </Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-2 mt-8">
                {/* Show all navigation links in mobile menu */}
                {navigationLinks
                  .filter((link) => link.href !== pathname)
                  .map((link) => {
                    const IconComponent = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <IconComponent className="h-4 w-4" />
                        {link.label}
                      </Link>
                    )
                  })}

                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                {/* Cart Button in mobile menu */}
                <div className="px-4 py-3">
                  {" "}
                  {/* Wrap to maintain consistent padding */}
                  <CartButton showLabel={true} variant="default" size="md" className="w-full justify-start" />
                </div>

                {/* Download link */}
                <Link
                  href="/download"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download App
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
