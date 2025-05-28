"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/logo"
import { HamburgerMenu } from "@/components/enhanced-hamburger-menu"
import { MobileMenuOverlay } from "@/components/mobile-menu-overlay"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Cart } from "@/components/cart"
import { Badge } from "@/components/ui/badge"

const primaryNavItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function ResponsiveHeader() {
  const { cart } = useCart()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-30 transition-all duration-300",
          isScrolled
            ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50"
            : "bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <Logo className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
                    "hover:text-blue-600 dark:hover:text-blue-400",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md",
                    pathname === item.href ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300",
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search services..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search Toggle */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="w-5 h-5" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  <span className="sr-only">3 notifications</span>
                </span>
              </Button>

              {/* Cart with Sheet Integration */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cart.totalItems > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-medium"
                      >
                        {cart.totalItems}
                      </Badge>
                    )}
                    <span className="sr-only">
                      Shopping cart with {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
                    </span>
                  </Button>
                </SheetTrigger>
                <Cart />
              </Sheet>

              {/* User Menu */}
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="w-5 h-5" />
                <span className="sr-only">User account</span>
              </Button>

              {/* Hamburger Menu */}
              <HamburgerMenu
                isOpen={isMobileMenuOpen}
                onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden"
              />
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search services..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
