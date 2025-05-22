"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Moon,
  Sun,
  Home,
  Info,
  Phone,
  Calculator,
  Briefcase,
  DollarSign,
  ChevronDown,
  User,
  ShoppingCart,
  Settings,
  LogOut,
  HelpCircle,
  Heart,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

// Define navigation items with their paths and icons
const navigationItems = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Services",
    path: "#",
    icon: DollarSign,
    dropdown: [
      { name: "Residential Cleaning", path: "/services/residential" },
      { name: "Commercial Cleaning", path: "/services/commercial" },
      { name: "Deep Cleaning", path: "/services/deep-cleaning" },
      { name: "Move In/Out Cleaning", path: "/services/move-in-out" },
      { name: "Specialty Services", path: "/services/specialty" },
    ],
  },
  {
    name: "About",
    path: "/about",
    icon: Info,
  },
  {
    name: "Contact",
    path: "/contact",
    icon: Phone,
  },
  {
    name: "Pricing",
    path: "/pricing",
    icon: DollarSign,
  },
  {
    name: "Calculator",
    path: "/calculator",
    icon: Calculator,
  },
  {
    name: "Careers",
    path: "/careers",
    icon: Briefcase,
  },
]

export default function UnifiedHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [cartCount, setCartCount] = useState(2) // Example cart count

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
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm h-16"
          : pathname === "/"
            ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md h-20"
            : "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md h-16",
      )}
      style={{ visibility: "visible", display: "block", opacity: 1 }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className={cn("transition-all", isScrolled || pathname !== "/" ? "h-8 w-auto" : "h-10 w-auto")} />
          <span
            className={cn(
              "font-bold transition-all",
              isScrolled || pathname !== "/" ? "text-xl" : "text-2xl",
              "hidden sm:inline",
            )}
          >
            SmileBrooms
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) =>
            item.dropdown ? (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-1" />
                    {item.name}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  <DropdownMenuLabel>Our Services</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {item.dropdown.map((subItem) => (
                    <DropdownMenuItem key={subItem.name} asChild>
                      <Link href={subItem.path}>{subItem.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
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
            ),
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full w-9 h-9 p-0 relative overflow-hidden transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="sr-only">Toggle theme</span>
            <Sun className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-indigo-400" />
          </Button>

          {/* Cart Button */}
          <Link href="/cart-demo" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Button>
          </Link>

          {/* User Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clock className="mr-2 h-4 w-4" />
                <span>Booking History</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                <span>Saved Services</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help Center</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Book Now Button */}
          <Link href="/calculator">
            <Button size="sm" className="ml-2">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center lg:hidden">
          {/* Theme Toggle */}
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

          {/* Cart Button */}
          <Link href="/cart-demo" className="relative mr-2">
            <Button variant="ghost" size="icon" className="rounded-full">
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

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] pt-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <Logo className="h-6 w-auto" />
                  <span className="font-bold text-lg">SmileBrooms</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                {navigationItems.map((item) =>
                  item.dropdown ? (
                    <div key={item.name} className="flex flex-col">
                      <div className="px-4 py-2 font-medium flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </div>
                      <div className="ml-8 flex flex-col gap-1 mb-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.path}
                            className="px-4 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
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
                  ),
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 my-4 pt-4">
                <div className="px-4 py-2 font-medium">Account</div>
                <Link
                  href="/account"
                  className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/bookings"
                  className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Clock className="h-4 w-4" />
                  Booking History
                </Link>
                <Link
                  href="/settings"
                  className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>

              <div className="px-4 mt-4">
                <Link href="/calculator" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Book Now</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
