"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, Home, Calculator, Users, Mail, Accessibility, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

export function EnhancedHeader() {
  const pathname = usePathname()
  const { cart } = useCart()
  const [hasItems, setHasItems] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Check if cart has items
  useEffect(() => {
    setHasItems(cart.items && cart.items.length > 0)
  }, [cart])

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation links - always include all links
  const navigationLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/pricing", label: "Pricing", icon: Calculator },
    { href: "/about", label: "About", icon: Users },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/accessibility", label: "Accessibility", icon: Accessibility },
  ]

  // Always render the full header
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80" : "bg-white dark:bg-gray-900",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Home page">
            <Logo />
          </Link>

          <nav className="hidden md:flex gap-1" role="menubar">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md",
                  "text-sm font-medium transition-all duration-200", // Changed to transition-all
                  "text-foreground/70 hover:text-foreground hover:bg-accent/50 hover:scale-[1.02]", // Added scale on hover
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  pathname === link.href && "bg-accent text-primary dark:bg-accent/20 dark:text-primary-foreground",
                )}
                role="menuitem"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button variant="outline" size="icon" aria-label={`Open cart with ${cart.items?.length || 0} items`} asChild>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {hasItems && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-background">
                  {cart.items?.length}
                </span>
              )}
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden bg-background">
                {" "}
                {/* Ensure background is always set */}
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-6" role="menu">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg",
                      "text-lg font-medium transition-colors duration-200",
                      "text-foreground hover:bg-accent",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      pathname === link.href && "bg-accent text-primary dark:bg-accent/20 dark:text-primary-foreground",
                    )}
                    role="menuitem"
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
                <Link
                  href="/download"
                  className="text-lg font-medium flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent transition-colors duration-200"
                  role="menuitem"
                >
                  <Download className="h-5 w-5" />
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
