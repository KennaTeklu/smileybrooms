"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { cart } = useCart()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Smiley Brooms</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Contact Info - Hidden on small screens */}
            <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Arizona</span>
              </div>
            </div>

            {/* Enhanced Cart Button */}
            <Link href="/cart" className="relative group">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "relative p-2.5 border-2 transition-all duration-200",
                  "hover:border-blue-500 hover:bg-blue-50 hover:scale-105",
                  "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  cart.items.length > 0 && "border-blue-500 bg-blue-50",
                )}
              >
                <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-blue-600" />

                {/* Enhanced Counter Badge */}
                {cart.items.length > 0 && (
                  <Badge
                    className={cn(
                      "absolute -top-2 -right-2 h-6 w-6 p-0",
                      "flex items-center justify-center",
                      "bg-red-500 hover:bg-red-600 text-white",
                      "border-2 border-white shadow-lg",
                      "text-xs font-bold",
                      "animate-pulse",
                      "min-w-[1.5rem]",
                    )}
                  >
                    {cart.items.length > 99 ? "99+" : cart.items.length}
                  </Badge>
                )}

                {/* Subtle glow effect for items in cart */}
                {cart.items.length > 0 && <div className="absolute inset-0 rounded-md bg-blue-500/10 animate-pulse" />}
              </Button>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {cart.items.length === 0
                  ? "Cart is empty"
                  : `${cart.items.length} item${cart.items.length === 1 ? "" : "s"} in cart`}
              </div>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile contact info */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Arizona</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
