"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { Cart } from "@/components/cart"
import { getLayoutConfig } from "@/lib/layout-config"

const navigationLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/calculator", label: "Calculator" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/tech-stack", label: "Tech Stack" },
  { href: "/email-summary", label: "Email Summary" },
]

export default function EnhancedHeader() {
  const pathname = usePathname()
  const { items } = useCart()
  const config = getLayoutConfig()

  const isHomePage = pathname === "/"
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const hasCartItems = cartItemCount > 0

  // Determine what to show based on page and cart state
  const shouldShowFullHeader = !isHomePage
  const shouldShowCartOnly = isHomePage && hasCartItems
  const shouldShowNothing = isHomePage && !hasCartItems

  if (shouldShowNothing) {
    return null
  }

  // Filter out current page from navigation
  const filteredLinks = navigationLinks.filter((link) => link.href !== pathname)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {shouldShowFullHeader && (
          <>
            {/* Logo and Brand */}
            <div className="mr-4 flex">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold text-xl">smileybrooms</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
              {filteredLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </>
        )}

        {/* Cart - Always show when applicable */}
        {(shouldShowFullHeader || shouldShowCartOnly) && (
          <div className={shouldShowCartOnly ? "w-full flex justify-end" : "ml-auto"}>
            <Cart>
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {hasCartItems && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Cart>
          </div>
        )}
      </div>
    </header>
  )
}
