"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, Info, Phone, Calculator, DollarSign, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"

export default function WebsiteHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/calculator", label: "Calculator", icon: Calculator },
    { href: "/careers", label: "Careers", icon: Briefcase },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg"
          : "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md",
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-auto" />
          <span className="font-bold text-xl text-primary hidden sm:block">SmileBrooms</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link href="/calculator">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Logo className="h-6 w-auto" />
                    <span className="font-bold text-lg">SmileBrooms</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2 py-4 flex-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                          pathname === item.href
                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile CTA */}
                <div className="border-t pt-4">
                  <Link href="/calculator" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" size="lg">
                      Book Cleaning Service
                    </Button>
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
