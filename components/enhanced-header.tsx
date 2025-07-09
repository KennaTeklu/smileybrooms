"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Home, Calculator, Users, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCart } from "@/lib/cart-context"
import CartButton from "@/components/cart-button"

const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pricing", label: "Pricing", icon: Calculator },
  { href: "/about", label: "About", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
]

export function EnhancedHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { cart } = useCart()
  const [isHomePage, setIsHomePage] = useState(false)
  const [hasItems, setHasItems] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsHomePage(pathname === "/")
  }, [pathname])

  useEffect(() => {
    setHasItems(cart.items && cart.items.length > 0)
  }, [cart])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleCartButtonClick = () => {
    router.push("/cart")
  }

  // If homepage and no items, don't show header
  if (isHomePage && !hasItems) {
    return null
  }

  // If homepage with items, only show cart
  if (isHomePage && hasItems) {
    return (
      <header
        className={`fixed top-0 right-0 z-40 p-4 transition-all duration-200 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80" : ""}`}
      >
        <div className="flex justify-end">
          <CartButton showLabel={false} variant="default" size="lg" onClick={handleCartButtonClick} />
        </div>
      </header>
    )
  }

  // Regular header for other pages
  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80" : "bg-white dark:bg-gray-900"}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex gap-6">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <CartButton showLabel={false} size="default" onClick={handleCartButtonClick} />

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-6">
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 text-lg font-medium hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent className="h-5 w-5" />
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
