"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import SmileyBroomsLogo from "./smiley-brooms-logo"
import { cn } from "@/lib/utils"

export default function Header() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <SmileyBroomsLogo className="h-8 w-8" />
          <span className="text-lg font-bold">Smiley Brooms</span>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-gray-600 dark:text-gray-400",
              )}
              prefetch={false}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart" aria-label={`View cart with ${totalItems} items`}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/pricing">Book Now</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
