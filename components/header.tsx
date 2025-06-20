"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Download, Calculator, Users, Mail, Accessibility, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import CartButton from "@/components/cart-button"
import { useCart } from "@/lib/cart-context"
import { useCartPanelVisibility } from "@/contexts/cart-panel-visibility-context" // New import

const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pricing", label: "Pricing", icon: Calculator },
  { href: "/about", label: "About", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/accessibility", label: "Accessibility", icon: Accessibility },
]

export default function Header() {
  const pathname = usePathname()
  const { cart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasItems, setHasItems] = useState(false)
  const { openCartPanel } = useCartPanelVisibility() // Use the new hook

  useEffect(() => {
    setHasItems(cart.items && cart.items.length > 0)
  }, [cart])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Homepage with items - minimal header
  if (pathname === "/" && hasItems) {
    return (
      <header id="main-header" className="fixed top-0 right-0 z-50 p-6" style={{ height: "64px" }} role="banner">
        <div className="flex justify-end">
          <CartButton showLabel={false} variant="default" size="lg" onClick={openCartPanel} />
        </div>
      </header>
    )
  }

  // Hidden header for homepage without items
  if (pathname === "/" && !hasItems) {
    return <header id="main-header" className="hidden" style={{ height: "0px" }} aria-hidden="true" />
  }

  // Filter navigation links (exclude current page)
  const availableLinks = navigationLinks.filter((link) => link.href !== pathname)

  // Main header for all other pages
  return (
    <header
      id="main-header"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        "border-b border-border/40",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background/90 backdrop-blur-sm",
      )}
      style={{ height: "64px" }}
      role="banner"
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
              aria-label="SmileyBrooms Home"
            >
              <Logo className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
              {availableLinks.slice(0, 4).map((link) => {
                const IconComponent = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md",
                      "text-sm font-medium transition-colors duration-200",
                      "text-foreground/70 hover:text-foreground",
                      "hover:bg-accent/50",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    )}
                    aria-label={`Go to ${link.label}`}
                  >
                    <IconComponent className="h-4 w-4" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Cart Button */}
              <CartButton onClick={openCartPanel} showLabel={false} size="default" /> {/* Added onClick */}
              {/* Download Button - Desktop Only */}
              <Button variant="outline" size="sm" asChild className="hidden md:flex h-9 px-3">
                <Link href="/download" className="flex items-center space-x-2" aria-label="Download our app">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden lg:inline">Download</span>
                </Link>
              </Button>
              {/* Mobile Menu */}
              <div className="lg:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0"
                      aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                      aria-expanded={isMenuOpen}
                      aria-controls="mobile-menu"
                    >
                      {isMenuOpen ? (
                        <X className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Menu className="h-5 w-5" aria-hidden="true" />
                      )}
                    </Button>
                  </SheetTrigger>

                  <SheetContent
                    side="right"
                    className="w-80 sm:w-96"
                    id="mobile-menu"
                    aria-labelledby="mobile-menu-title"
                  >
                    <SheetHeader className="text-left">
                      <SheetTitle id="mobile-menu-title" className="text-lg font-semibold">
                        Navigation Menu
                      </SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col space-y-6 mt-8">
                      {/* Mobile Navigation Links */}
                      <nav className="flex flex-col space-y-1" role="navigation" aria-label="Mobile navigation">
                        {availableLinks.map((link) => {
                          const IconComponent = link.icon
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg",
                                "text-base font-medium transition-colors duration-200",
                                "text-foreground hover:bg-accent",
                                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                              )}
                              onClick={() => setIsMenuOpen(false)}
                              aria-label={`Go to ${link.label}`}
                            >
                              <IconComponent className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                              <span>{link.label}</span>
                            </Link>
                          )
                        })}
                      </nav>

                      {/* Divider */}
                      <div className="border-t border-border" role="separator" />

                      {/* Mobile Action Buttons */}
                      <div className="flex flex-col space-y-3 px-4">
                        {/* Cart Button - Full Width */}
                        <CartButton
                          onClick={openCartPanel} // Added onClick
                          showLabel={true}
                          variant="default"
                          size="default"
                          className="w-full justify-start h-11"
                        />

                        {/* Download Button - Full Width */}
                        <Button variant="outline" size="default" asChild className="w-full justify-start h-11">
                          <Link
                            href="/download"
                            className="flex items-center space-x-3"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Download our mobile app"
                          >
                            <Download className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                            <span>Download App</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
