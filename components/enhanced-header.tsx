"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Home, DollarSign, Users, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCart } from "@/lib/cart-context"
import CartButton from "@/components/cart-button"

/**
 * Central place for links shown in the header
 * – keeps both desktop and mobile navigation in sync
 */
const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/about", label: "About", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
] as const

export function EnhancedHeader() {
  const pathname = usePathname()
  const router = useRouter()

  /* cart & UI state ------------------------------------------------------- */
  const { cart } = useCart()
  const [hasItems, setHasItems] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  /* detect if the current route is exactly "/" ---------------------------- */
  const isHomePage = pathname === "/"

  /* side-effects ---------------------------------------------------------- */
  useEffect(() => {
    setHasItems(!!cart.items?.length)
  }, [cart.items])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* handlers -------------------------------------------------------------- */
  const goToCart = () => router.push("/cart")

  /* render shortcuts ------------------------------------------------------ */
  const containerCls = "container flex h-16 items-center justify-between transition-all"

  /* 1️⃣ No header (home page with empty cart) ----------------------------- */
  if (isHomePage && !hasItems) return null

  /* 2️⃣ Cart-only header (home page with items) --------------------------- */
  if (isHomePage && hasItems) {
    return (
      <header
        className={`fixed top-0 right-0 z-40 p-4 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80" : ""
        }`}
      >
        <CartButton showLabel={false} variant="default" size="lg" onClick={goToCart} />
      </header>
    )
  }

  /* 3️⃣ Regular header (all other pages) ---------------------------------- */
  return (
    <header
      className={`sticky top-0 z-40 w-full ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80" : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className={containerCls}>
        {/* ---------- brand + desktop nav ---------- */}
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden gap-6 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ---------- right-hand controls ---------- */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <CartButton showLabel={false} onClick={goToCart} />

          {/* mobile menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
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
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default EnhancedHeader
