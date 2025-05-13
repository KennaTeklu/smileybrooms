"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Calendar, ShoppingCart, Download, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const { cart } = useCart()

  // Calculate total items safely
  const totalItems = cart?.items ? cart.items.reduce((total, item) => total + (item?.quantity || 0), 0) : 0

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Only include links to pages that exist in the codebase
  const mainNavLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ]

  const secondaryNavLinks = [
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/download", label: "Download App", icon: Download },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || pathname !== "/"
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-6">
            <Logo className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Secondary Nav Items - Desktop Only */}
          <div className="hidden md:flex items-center">
            {secondaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 flex items-center"
              >
                {link.icon && <link.icon className="mr-1 h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart Button */}
          <Link
            href="/checkout"
            className="relative p-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Book Now Button (visible on desktop) */}
          <div className="hidden md:block">
            <Button asChild variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Link href="/pricing">
                <Calendar className="mr-2 h-4 w-4" />
                Book Now
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
                      pathname === link.href
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="h-px bg-gray-200 dark:bg-gray-800 my-2"></div>

                {secondaryNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/checkout"
                  className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>

                <Button asChild className="mt-2">
                  <Link href="/pricing">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
