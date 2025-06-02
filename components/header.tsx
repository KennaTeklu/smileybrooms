"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      setIsScrolled(scrolled)

      // Header visibility logging
      console.log("📋 Header Scroll State:", {
        scrollY: window.scrollY,
        isScrolled: scrolled,
        headerVisible: true,
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    console.log("📋 Header initialized with sticky positioning")
  }, [])

  return (
    <header
      className={cn(
        "sticky-header transition-all duration-300",
        isScrolled || pathname !== "/"
          ? "bg-white/95 dark:bg-gray-950/95 shadow-sm"
          : "bg-white/90 dark:bg-gray-950/90",
      )}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1001,
        height: "64px", // 1.69cm
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          {/* Navigation links for larger screens */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Download button for desktop */}
          <div className="hidden md:block">
            <Button variant="outline" size="sm" asChild>
              <Link href="/download" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download App
              </Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/pricing" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  Pricing
                </Link>
                <Link href="/about" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  About
                </Link>
                <Link href="/contact" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  Contact
                </Link>
                <Link
                  href="/download"
                  className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download App
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
