"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Home, Info, Phone, Calculator, DollarSign, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Initialize cart count (this is a placeholder - you would get this from your cart context)
    setCartCount(2)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/about", label: "About", icon: <Info className="h-4 w-4 mr-2" /> },
    { href: "/contact", label: "Contact", icon: <Phone className="h-4 w-4 mr-2" /> },
    { href: "/calculator", label: "Calculator", icon: <Calculator className="h-4 w-4 mr-2" /> },
    { href: "/pricing", label: "Pricing", icon: <DollarSign className="h-4 w-4 mr-2" /> },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled || pathname !== "/"
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm"
          : "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md",
      )}
      style={{ visibility: "visible", display: "block", opacity: 1 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart-demo" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/calculator">
            <Button variant="default" size="sm">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <Link href="/cart-demo" className="relative mr-2">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center",
                      pathname === item.href ? "bg-gray-100 dark:bg-gray-800 text-primary" : "",
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
                  <Link
                    href="/account"
                    className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Link>
                  <Link href="/calculator" className="mt-4 px-4">
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
