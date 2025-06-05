"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Cart } from "@/components/cart"
import { Badge } from "@/components/ui/badge"

export function EnhancedHeader() {
  const pathname = usePathname()
  const { cart } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const totalItems = cart.items?.length || 0
  const hasItems = totalItems > 0

  // Header visibility rules
  const isHomePage = pathname === "/"
  const shouldShowFullHeader = !isHomePage
  const shouldShowCartOnHome = isHomePage && hasItems

  // Navigation items
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
    { href: "/download", label: "Download" },
  ]

  // Filter out current page from navigation
  const filteredNavItems = navItems.filter((item) => item.href !== pathname)

  // Don't render header on homepage unless cart has items
  if (isHomePage && !hasItems) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand - Only show on non-home pages */}
          {shouldShowFullHeader && (
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SB</span>
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-gray-100">SmileyBrooms</span>
              </Link>
            </div>
          )}

          {/* Navigation - Only show on non-home pages */}
          {shouldShowFullHeader && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          )}

          {/* Cart - Always show when has items */}
          {hasItems && (
            <div className={shouldShowFullHeader ? "" : "ml-auto"}>
              <Cart>
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {hasItems && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Cart>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {shouldShowFullHeader && isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-3">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
