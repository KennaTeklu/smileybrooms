"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Home, Phone, Info, Calendar, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import { AnimatedDownloadButton } from "@/components/animated-download-button"
import { InteractivePhoneNumber } from "@/components/interactive-phone-number"

// Define navigation items
const navigationItems = [
  { name: "Home", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
  { name: "Pricing", href: "/pricing", icon: <Calendar className="h-4 w-4 mr-2" /> },
  { name: "About", href: "/about", icon: <Info className="h-4 w-4 mr-2" /> },
  { name: "Contact", href: "/contact", icon: <Phone className="h-4 w-4 mr-2" /> },
  { name: "Support", href: "/support", icon: <HelpCircle className="h-4 w-4 mr-2" /> },
]

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || pathname !== "/"
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo className="hover:opacity-90 transition-opacity" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => {
            // Skip rendering this nav item if we're currently on its page
            if (pathname === item.href) return null

            return (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center"
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          {/* Phone Call Button */}
          <InteractivePhoneNumber phoneNumber="(602) 800-0605" variant="default" />

          {/* Animated Download Button */}
          <div className="hidden md:block">
            <AnimatedDownloadButton />
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                {navigationItems.map((item) => (
                  // Don't filter out current page in mobile menu for better UX
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2",
                      pathname === item.href && "bg-gray-100 dark:bg-gray-800 font-medium",
                    )}
                  >
                    {item.icon}
                    {item.name}
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
