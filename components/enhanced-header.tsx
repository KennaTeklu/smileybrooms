"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Cart } from "@/components/cart"
import { Badge } from "@/components/ui/badge"

const NAVIGATION_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
  { href: "/download", label: "Download" },
]

export function EnhancedHeader() {
  const pathname = usePathname()
  const { cart } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const totalItems = cart.items?.length || 0
  const hasItems = totalItems > 0
  const isHomePage = pathname === "/"

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Header visibility rules:
  // - Homepage: Only show cart when it has items
  // - Other pages: Show full header with navigation
  if (isHomePage) {
    // Homepage: Only show cart if it has items
    if (!hasItems) {
      return null
    }

    return (
      <header className="fixed top-0 right-0 z-40 p-4">
        <Cart>
          <Button variant="default" size="sm" className="relative bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
            {hasItems && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </Cart>
      </header>
    )
  }

  // Other pages: Show full header
  const filteredNavItems = NAVIGATION_ITEMS.filter((item) => item.href !== pathname)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">SmileyBrooms</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Cart>
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {hasItems && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Cart>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white dark:bg-gray-950">
            <nav className="flex flex-col space-y-2 p-4">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors py-2"
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
