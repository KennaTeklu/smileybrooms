"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

const footerLinks = {
  services: [
    { href: "/pricing", label: "Pricing" },
    { href: "/calculator", label: "Price Calculator" },
    { href: "/email-summary", label: "Email Summary" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
  support: [
    { href: "/accessibility", label: "Accessibility" },
    { href: "/tech-stack", label: "Tech Stack" },
    { href: "/download", label: "Download" },
  ],
}

export default function EnhancedFooter() {
  const pathname = usePathname()
  const { items } = useCart()

  const isHomePage = pathname === "/"
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Same logic as header: only show on homepage if cart has items
  const shouldShowFooter = !isHomePage || cartItemCount > 0

  if (!shouldShowFooter) {
    return null
  }

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="font-bold text-xl">
              smileybrooms
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional cleaning services with a smile. Making your space sparkle.
            </p>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services
                .filter((link) => link.href !== pathname)
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company
                .filter((link) => link.href !== pathname)
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support
                .filter((link) => link.href !== pathname)
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">© 2024 smileybrooms. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
