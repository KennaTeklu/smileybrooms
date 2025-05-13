"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Calendar,
  ShoppingCart,
  Clock,
  Shield,
  Award,
  Star,
  Home,
  Info,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useCart } from "@/lib/cart-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

const primaryNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: Settings },
  { name: "Pricing", href: "/pricing", icon: Clock },
  { name: "About", href: "/about", icon: Info },
]

const secondaryNavItems = [
  { name: "Contact", href: "/contact" },
  { name: "Careers", href: "/careers" },
  { name: "Download App", href: "/download" },
]

const features = [
  { name: "100% Satisfaction", description: "Guaranteed or your money back", icon: Shield },
  { name: "Trusted Professionals", description: "Background-checked and trained", icon: Award },
  { name: "Easy Scheduling", description: "Book online in 60 seconds", icon: Calendar },
  { name: "5-Star Service", description: "Rated 4.9/5 by our customers", icon: Star },
]

export function SalesNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const { cart } = useCart()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white dark:bg-gray-900 shadow-md py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo
            href="/"
            linkClassName="flex-shrink-0"
            className={cn("h-10 w-auto transition-all duration-300", isScrolled ? "h-8" : "h-10")}
          />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {primaryNavItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                    pathname === item.href
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400",
                  )}
                  onMouseEnter={() => item.name === "Services" && handleDropdownToggle("services")}
                  onClick={() => handleDropdownToggle("services")}
                >
                  <span className="flex items-center">
                    {item.name}
                    {item.name === "Services" && <ChevronDown className="ml-1 h-4 w-4" />}
                  </span>

                  {/* Active indicator */}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 dark:bg-primary-400"
                    />
                  )}
                </Link>

                {/* Services Dropdown */}
                {item.name === "Services" && (
                  <AnimatePresence>
                    {activeDropdown === "services" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                        onMouseLeave={() => handleDropdownToggle("services")}
                      >
                        <div className="p-4 grid gap-4">
                          <div className="grid grid-cols-1 gap-4">
                            <Link
                              href="/services/home-cleaning"
                              className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-primary-500 text-white">
                                <Home className="h-6 w-6" />
                              </div>
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-900 dark:text-white">Home Cleaning</p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  Regular cleaning for homes and apartments
                                </p>
                              </div>
                            </Link>

                            <Link
                              href="/services/deep-cleaning"
                              className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-primary-500 text-white">
                                <Settings className="h-6 w-6" />
                              </div>
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-900 dark:text-white">Deep Cleaning</p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  Thorough cleaning for homes that need extra attention
                                </p>
                              </div>
                            </Link>

                            <Link
                              href="/services"
                              className="flex items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                            >
                              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                View All Services
                              </span>
                              <ChevronDown className="ml-1 h-4 w-4 rotate-270" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Phone number */}
            <a
              href="tel:+1234567890"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              <Phone className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">1-800-CLEANING</span>
            </a>

            {/* Book Now button */}
            <Button asChild size="sm" className="bg-primary-600 hover:bg-primary-700">
              <Link href="/pricing">Book Now</Link>
            </Button>

            {/* Cart */}
            <Link
              href="/checkout"
              className="relative p-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart?.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link
              href="/checkout"
              className="relative p-2 mr-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart?.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="grid gap-2">
                {primaryNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center p-3 rounded-md",
                      pathname === item.href
                        ? "bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800",
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-4">
                  <Button asChild className="w-full bg-primary-600 hover:bg-primary-700">
                    <Link href="/pricing">Book Now</Link>
                  </Button>
                </div>

                <a
                  href="tel:+1234567890"
                  className="flex items-center justify-center mt-2 p-3 rounded-md text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  <span>1-800-CLEANING</span>
                </a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust badges - only show when scrolled on desktop */}
      <AnimatePresence>
        {isScrolled && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="hidden md:block bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="container mx-auto px-4 py-2">
              <div className="flex justify-between items-center">
                {features.map((feature) => (
                  <div key={feature.name} className="flex items-center">
                    <feature.icon className="h-4 w-4 text-primary-500 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{feature.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
