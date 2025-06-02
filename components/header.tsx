"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Download, ShoppingCart, Calculator, Users, Mail, Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"

// Define navigation structure
const navigationLinks = [
  { href: "/pricing", label: "Pricing", icon: Calculator },
  { href: "/about", label: "About", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/accessibility", label: "Accessibility", icon: Accessibility },
  { href: "/cart-lists", label: "Cart Lists", icon: ShoppingCart },
  { href: "/advanced-cart", label: "Advanced Cart", icon: ShoppingCart },
  { href: "/cart-insights", label: "Cart Insights", icon: ShoppingCart },
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
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    setShouldRender(pathname !== "/")
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      setIsScrolled(scrolled)

      // Header visibility logging
      console.log("📋 Header Scroll State:", {
        scrollY: window.scrollY,
        isScrolled: scrolled,
        headerVisible: true,
        currentPage: pathname,
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  useEffect(() => {
    console.log("📋 Header initialized with dynamic navigation for:", pathname)
  }, [pathname])

  // Filter out current page from navigation
  const getVisibleLinks = () => {
    // Always show essential links except current page
    const filteredEssentials = essentialLinks.filter((link) => link.href !== pathname)

    // Add cart-related links if not on current page
    const cartLinks = navigationLinks.filter((link) => link.href.includes("cart") && link.href !== pathname)

    // Combine and deduplicate
    const allLinks = [...filteredEssentials, ...cartLinks]
    const uniqueLinks = allLinks.filter((link, index, self) => index === self.findIndex((l) => l.href === link.href))

    return uniqueLinks.slice(0, 4) // Limit to 4 links for clean UI
  }

  const visibleLinks = getVisibleLinks()

  if (!shouldRender) {
    return null
  }

  return (
    <header
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

          {/* Cart button - always visible */}
          <Link href="/cart-lists" className="relative">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>

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

                {/* Cart link with count */}
                <Link
                  href="/cart-lists"
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>

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
