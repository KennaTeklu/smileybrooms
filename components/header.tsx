"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" // Added useRouter
import { Menu, Download, Calculator, Users, Mail, Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  const router = useRouter() // Initialize useRouter
  const { cart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [shouldRender, setShouldRender] = useState(pathname !== "/")
  const [hasItems, setHasItems] = useState(false)

  useEffect(() => {
    setShouldRender(pathname !== "/")
  }, [pathname])

  useEffect(() => {
    setHasItems(cart.items && cart.items.length > 0)
  }, [cart])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      setIsScrolled(scrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  const getVisibleLinks = () => {
    const filteredLinks = navigationLinks.filter((link) => link.href !== pathname)
    return filteredLinks.slice(0, 4)
  }

  const handleCartButtonClick = () => {
    // Defined handler
    router.push("/cart")
  }

  const visibleLinks = getVisibleLinks()

  // Homepage with items - minimal header with ID for positioning
  if (pathname === "/" && hasItems) {
    return (
      <header id="main-header" className="fixed top-0 right-0 z-50 p-6" style={{ height: "64px" }}>
        <div className="flex justify-end">
          <CartButton showLabel={false} variant="default" size="lg" onClick={handleCartButtonClick} />{" "}
          {/* Added onClick */}
        </div>
      </header>
    )
  }

  // Don't show header on homepage without items
  if (pathname === "/" && !hasItems) {
    return (
      // Hidden header with ID for positioning calculations
      <header id="main-header" className="hidden" style={{ height: "0px" }} aria-hidden="true" />
    )
  }

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
    >
      {/* Main container with proper spacing grid */}
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo section - consistent spacing */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
              aria-label="SmileyBrooms Home"
            >
              <Logo className="h-8 w-auto" />
            </Link>
          </div>

          {/* Navigation and actions - proper spacing hierarchy */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Desktop navigation - consistent spacing */}
            <nav className="hidden lg:flex items-center space-x-1" role="navigation">
              {visibleLinks.map((link) => {
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
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Action buttons - consistent sizing and spacing */}
            <div className="flex items-center space-x-2">
              {/* Cart button - proper touch target */}
              <div className="flex items-center">
                <CartButton showLabel={false} size="default" onClick={handleCartButtonClick} /> {/* Added onClick */}
              </div>

              {/* Download button - desktop only */}
              <div className="hidden md:flex">
                <Button variant="outline" size="sm" asChild className="h-9 px-3 bg-transparent">
                  <Link href="/download" className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden lg:inline">Download</span>
                  </Link>
                </Button>
              </div>

              {/* Mobile menu trigger - proper touch target */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0" aria-label="Open navigation menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>

                  <SheetContent side="right" className="w-80 sm:w-96">
                    {/* Mobile menu content with proper spacing */}
                    <div className="flex flex-col space-y-4 mt-8">
                      {/* Mobile navigation links */}
                      <nav className="flex flex-col space-y-2" role="navigation">
                        {navigationLinks
                          .filter((link) => link.href !== pathname)
                          .map((link) => {
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
                                onClick={() => router.push(link.href)} // Ensure mobile links also navigate
                              >
                                <IconComponent className="h-5 w-5" />
                                <span>{link.label}</span>
                              </Link>
                            )
                          })}
                      </nav>

                      {/* Divider */}
                      <div className="border-t border-border" />

                      {/* Mobile action buttons */}
                      <div className="flex flex-col space-y-3 px-4">
                        {/* Cart button - full width for mobile */}
                        <CartButton
                          showLabel={true}
                          variant="default"
                          size="default"
                          className="w-full justify-start h-11"
                          onClick={handleCartButtonClick} // Added onClick
                        />

                        {/* Download button - full width for mobile */}
                        <Button
                          variant="outline"
                          size="default"
                          asChild
                          className="w-full justify-start h-11 bg-transparent"
                        >
                          <Link href="/download" className="flex items-center space-x-3">
                            <Download className="h-5 w-5" />
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
