"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun, Home, Info, Phone, Calculator, Briefcase, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import CartButton from "./cart-button"
import { MegaMenu } from "./mega-menu"

// Define navigation items with their paths, icons, and submenu items
const navigationItems = [
  {
    name: "Home",
    path: "/",
    icon: Home,
    megaMenu: false,
  },
  {
    name: "About",
    path: "/about",
    icon: Info,
    megaMenu: true,
    sections: [
      {
        title: "Company",
        items: [
          { name: "Our Story", path: "/about#our-story" },
          { name: "Mission & Vision", path: "/about#mission-vision" },
          { name: "Core Values", path: "/about#core-values" },
          { name: "Our Commitment", path: "/about#our-commitment" },
        ],
      },
      {
        title: "Why Choose Us",
        items: [
          { name: "Our Approach", path: "/about#why-smileybrooms" },
          { name: "Cleaning Standards", path: "/about#cleaning-standards" },
          { name: "Eco-Friendly Practices", path: "/about#eco-friendly" },
          { name: "Customer Testimonials", path: "/about#testimonials" },
        ],
      },
      {
        title: "Resources",
        items: [
          { name: "Cleaning Tips", path: "/resources/cleaning-tips" },
          { name: "FAQ", path: "/resources/faq" },
          { name: "Blog", path: "/resources/blog" },
        ],
      },
    ],
  },
  {
    name: "Services",
    path: "/services",
    icon: Calculator,
    megaMenu: true,
    sections: [
      {
        title: "Residential",
        items: [
          { name: "Regular Cleaning", path: "/services/regular-cleaning" },
          { name: "Deep Cleaning", path: "/services/deep-cleaning" },
          { name: "Move In/Out", path: "/services/move-in-out" },
        ],
      },
      {
        title: "Commercial",
        items: [
          { name: "Office Cleaning", path: "/services/office-cleaning" },
          { name: "Retail Spaces", path: "/services/retail-cleaning" },
          { name: "Medical Facilities", path: "/services/medical-cleaning" },
        ],
      },
      {
        title: "Specialty",
        items: [
          { name: "Carpet Cleaning", path: "/services/carpet-cleaning" },
          { name: "Window Cleaning", path: "/services/window-cleaning" },
          { name: "Post-Construction", path: "/services/post-construction" },
        ],
      },
    ],
  },
  {
    name: "Pricing",
    path: "/pricing",
    icon: Calculator,
    megaMenu: false,
  },
  {
    name: "Contact",
    path: "/contact",
    icon: Phone,
    megaMenu: false,
  },
  {
    name: "Careers",
    path: "/careers",
    icon: Briefcase,
    megaMenu: false,
  },
]

export default function EnhancedNavigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const navRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle scroll event to update isScrolled state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle mouse enter for mega menu
  const handleMouseEnter = (itemName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setActiveMegaMenu(itemName)
  }

  // Handle mouse leave for mega menu with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null)
    }, 300)
  }

  return (
    <header
      ref={navRef}
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm"
          : pathname === "/"
            ? "bg-transparent"
            : "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md",
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center max-w-xs w-full mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search services, tips, etc."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => item.megaMenu && handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  pathname === item.path && "bg-gray-100 dark:bg-gray-800",
                )}
                onClick={() => setActiveMegaMenu(null)}
              >
                <span className="flex items-center gap-1">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {item.megaMenu && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        activeMegaMenu === item.name && "transform rotate-180",
                      )}
                    />
                  )}
                </span>
              </Link>

              {/* Mega Menu */}
              {item.megaMenu && activeMegaMenu === item.name && item.sections && (
                <MegaMenu sections={item.sections} onClose={() => setActiveMegaMenu(null)} />
              )}
            </div>
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

          <CartButton />
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

          <CartButton />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Logo className="h-8 w-auto" />
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                {/* Mobile Search */}
                <div className="p-4 border-b">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search services, tips, etc."
                      className="w-full pl-10 pr-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex-1 overflow-auto py-2">
                  {navigationItems.map((item) => (
                    <div key={item.name} className="px-4 py-1">
                      <Link
                        href={item.path}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
                          pathname === item.path && "bg-gray-100 dark:bg-gray-800",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </span>
                        {item.megaMenu && <ChevronDown className="h-5 w-5" />}
                      </Link>

                      {/* Mobile Submenu */}
                      {item.megaMenu && item.sections && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.sections.map((section) => (
                            <div key={section.title} className="mb-2">
                              <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-3 py-1">
                                {section.title}
                              </h4>
                              <div className="space-y-1">
                                {section.items.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.path}
                                    className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Footer */}
                <div className="p-4 border-t">
                  <Button className="w-full" size="sm">
                    Book Now
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
