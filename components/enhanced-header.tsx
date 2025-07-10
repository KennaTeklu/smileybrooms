"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo" // Ensure this imports the updated Logo
import { ThemeToggle } from "@/components/theme-toggle"
import { useCart } from "@/lib/cart-context"
import { useTranslation } from "@/contexts/translation-context" // Import useTranslation

export function EnhancedHeader() {
  const pathname = usePathname()
  const { cart } = useCart()
  const [isHomePage, setIsHomePage] = useState(false)
  const [hasItems, setHasItems] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { t } = useTranslation() // Use the translation hook

  // Check if current page is homepage
  useEffect(() => {
    setIsHomePage(pathname === "/")
  }, [pathname])

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
          <Button variant="outline" size="icon" aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            {hasItems && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {cart.items?.length}
              </span>
            )}
          </Button>
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
          <Link href="/">
            <Logo /> {/* This will now use favicon.png */}
          </Link>

          <nav className="hidden md:flex gap-6">
            {pathname !== "/" && (
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.home")}
              </Link>
            )}
            {pathname !== "/pricing" && (
              <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.pricing")}
              </Link>
            )}
            {pathname !== "/about" && (
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.about")}
              </Link>
            )}
            {pathname !== "/contact" && (
              <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.contact")}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button variant="outline" size="icon" aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            {hasItems && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {cart.items?.length}
              </span>
            )}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-6">
                {pathname !== "/" && (
                  <Link href="/" className="text-lg font-medium">
                    {t("common.home")}
                  </Link>
                )}
                {pathname !== "/pricing" && (
                  <Link href="/pricing" className="text-lg font-medium">
                    {t("common.pricing")}
                  </Link>
                )}
                {pathname !== "/about" && (
                  <Link href="/about" className="text-lg font-medium">
                    {t("common.about")}
                  </Link>
                )}
                {pathname !== "/contact" && (
                  <Link href="/contact" className="text-lg font-medium">
                    {t("common.contact")}
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
