"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Download, Calculator, Users, Mail, Accessibility, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import CartButton from "@/components/cart-button"
import { useCart } from "@/lib/cart-context"

const navigationLinks = [
  { href: "/pricing", label: "Pricing", icon: Calculator },
  { href: "/about", label: "About", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/accessibility", label: "Accessibility", icon: Accessibility },
]

export default function Header() {
  const pathname = usePathname()
  const { cart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [shouldRender, setShouldRender] = useState(pathname !== "/")
  const [hasItems, setHasItems] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const lastScrollY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setShouldRender(pathname !== "/")
  }, [pathname])

  useEffect(() => {
    setHasItems(cart.items && cart.items.length > 0)
  }, [cart])

  // Enhanced scroll behavior with direction detection
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const scrollDifference = currentScrollY - lastScrollY.current

    // Only update if scroll difference is significant (reduces jitter)
    if (Math.abs(scrollDifference) > 5) {
      setIsScrollingDown(scrollDifference > 0 && currentScrollY > 100)
      setIsScrolled(currentScrollY > 20)
      lastScrollY.current = currentScrollY
    }
  }, [])

  useEffect(() => {
    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Handle mobile menu state
  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    },
    [isMobileMenuOpen],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const getVisibleLinks = () => {
    const filteredLinks = navigationLinks.filter((link) => link.href !== pathname)
    return filteredLinks.slice(0, 4)
  }

  const visibleLinks = getVisibleLinks()

  // If homepage and no items, don't show header
  if (pathname === "/" && !hasItems) {
    return null
  }

  // If homepage with items, only show cart button
  if (pathname === "/" && hasItems) {
    return (
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 right-0 z-40 p-4 transition-all duration-300",
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90" : "",
          isScrollingDown ? "translate-y-0" : "",
        )}
        role="banner"
        aria-label="Site header"
      >
        <div className="flex justify-end">
          <CartButton
            showLabel={false}
            variant="default"
            size="md"
            position="header"
            className="min-h-[44px] min-w-[44px]" // Ensure minimum touch target
          />
        </div>
      </header>
    )
  }

  // Regular header for other pages
  return (
    <header
      id="main-header"
      ref={headerRef}
      className={cn(
        "sticky top-0 z-[1001] w-full transition-all duration-300",
        "bg-white/95 backdrop-blur-md border-b border-gray-200/20",
        "dark:bg-gray-950/95 dark:border-gray-800/20",
        isScrolled && "shadow-sm",
        isScrollingDown && pathname !== "/" && "transform -translate-y-full",
      )}
      style={{
        height: "64px",
      }}
      role="banner"
      aria-label="Main navigation"
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded-md"
          aria-label="SmileyBrooms home"
        >
          <Logo className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {visibleLinks.map((link) => {
              const IconComponent = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 min-h-[44px]", // Minimum touch target
                    "text-sm font-medium rounded-md transition-all duration-200",
                    "text-gray-700 dark:text-gray-300",
                    "hover:text-blue-600 dark:hover:text-blue-400",
                    "hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  )}
                  aria-label={`Navigate to ${link.label}`}
                >
                  <IconComponent className="h-4 w-4" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Cart Button */}
          <CartButton
            showLabel={true}
            className="min-h-[44px]" // Ensure minimum touch target
          />

          {/* Download button for desktop */}
          <div className="hidden md:block">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="min-h-[44px]" // Ensure minimum touch target
            >
              <Link href="/download" className="flex items-center gap-2" aria-label="Download SmileyBrooms app">
                <Download className="h-4 w-4" aria-hidden="true" />
                <span className="hidden lg:inline">Download</span>
              </Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden min-h-[44px] min-w-[44px]" // Ensure minimum touch target
                onClick={handleMobileMenuToggle}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]" aria-labelledby="mobile-nav-title">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 id="mobile-nav-title" className="text-lg font-semibold">
                  Navigation
                </h2>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-h-[44px] min-w-[44px]"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>

              <nav
                id="mobile-navigation"
                className="flex flex-col gap-1 mt-6"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {/* Navigation links */}
                {navigationLinks
                  .filter((link) => link.href !== pathname)
                  .map((link) => {
                    const IconComponent = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 min-h-[44px]", // Minimum touch target
                          "rounded-md transition-all duration-200 text-base",
                          "text-gray-700 dark:text-gray-300",
                          "hover:bg-gray-100 dark:hover:bg-gray-800",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label={`Navigate to ${link.label}`}
                      >
                        <IconComponent className="h-4 w-4" aria-hidden="true" />
                        <span>{link.label}</span>
                      </Link>
                    )
                  })}

                <div className="border-t border-gray-200 dark:border-gray-700 my-3" />

                {/* Cart Button in mobile menu */}
                <div className="px-4 py-2">
                  <CartButton
                    showLabel={true}
                    variant="default"
                    size="md"
                    className="w-full justify-start min-h-[44px]"
                  />
                </div>

                {/* Download link */}
                <Link
                  href="/download"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 min-h-[44px]", // Minimum touch target
                    "rounded-md transition-all duration-200 text-base",
                    "text-gray-700 dark:text-gray-300",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Download SmileyBrooms app"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>Download App</span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
