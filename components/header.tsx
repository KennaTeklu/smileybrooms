"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import { AnimatedDownloadButton } from "@/components/animated-download-button"
import { ThemeToggle } from "@/components/theme-toggle"

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
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || pathname !== "/"
          ? "glass-light shadow-elegant border-b border-gradient"
          : "glass-light shadow-soft",
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center button-hover-lift">
          <Logo className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Animated Download Button */}
          <div className="hidden md:block">
            <AnimatedDownloadButton />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden glass-light shadow-soft button-hover-lift">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="glass-light border-gradient">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center justify-between px-4 py-3 glass-light rounded-lg shadow-soft">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/download"
                  className="px-4 py-3 rounded-lg glass-light shadow-soft button-hover-lift flex items-center gap-2 transition-all duration-200"
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
