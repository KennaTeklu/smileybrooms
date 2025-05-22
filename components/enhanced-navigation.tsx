"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun, Home, Info, Phone, Calculator, Briefcase, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import SingleCartButton from "./single-cart-button"

// Define navigation items with their paths and icons
const navigationItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Phone },
  { name: "Pricing", path: "/pricing", icon: DollarSign },
  { name: "Calculator", path: "/calculator", icon: Calculator },
  { name: "Careers", path: "/careers", icon: Briefcase },
]

export default function EnhancedNavigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm"
          : pathname === "/"
            ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md"
            : "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md",
      )}
      style={{ visibility: "visible", display: "block", opacity: 1 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-auto" />
          <span className="font-bold text-xl hidden sm:inline">SmileBrooms</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                pathname === item.path ? "bg-gray-100 dark:bg-gray-800 text-primary" : "text-muted-foreground",
              )}
            >
              <span className="flex items-center gap-1">
                <item.icon className="h-4 w-4" />
                {item.name}
              </span>
            </Link>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-2 rounded-full w-9 h-9 p-0 relative overflow-hidden transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="sr-only">Toggle theme</span>
            <Sun className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-indigo-400" />
          </Button>

          <SingleCartButton />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2 rounded-full w-9 h-9 p-0 relative overflow-hidden transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="sr-only">Toggle theme</span>
            <Sun className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-indigo-400" />
          </Button>

          <SingleCartButton />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex justify-between items-center mb-6">
                <Logo className="h-6 w-auto" />
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={cn(
                      "px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2",
                      pathname === item.path ? "bg-gray-100 dark:bg-gray-800 text-primary" : "",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
                  <Link href="/calculator" className="mt-4 px-4" onClick={() => setIsOpen(false)}>
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
