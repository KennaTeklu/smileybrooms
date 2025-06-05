"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"

export function EnhancedHeader() {
  const pathname = usePathname()
  const { items } = useCart()
  const [isHomePage, setIsHomePage] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const cartHasItems = items.length > 0

  // Navigation links - exclude current page
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
  ].filter((item) => item.href !== pathname)

  useEffect(() => {
    setIsMounted(true)
    setIsHomePage(pathname === "/")

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) return null

  // On homepage, only show cart when it has items
  if (isHomePage && !cartHasItems) {
    return null
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Only show logo on non-homepage or when cart has items on homepage */}
        {(!isHomePage || cartHasItems) && (
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
              <span className="font-bold text-xl hidden md:inline-block">SmileyBrooms</span>
            </Link>

            {/* Desktop navigation - hide on homepage */}
            {!isHomePage && (
              <nav className="hidden md:flex gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Theme toggle - show on all pages */}
          <ThemeToggle />

          {/* Cart button - show on all pages when cart has items */}
          {cartHasItems && (
            <Button variant="outline" size="icon" asChild>
              <Link href="/cart" aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {items.length}
                </span>
              </Link>
            </Button>
          )}

          {/* Mobile menu - hide on homepage */}
          {!isHomePage && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
