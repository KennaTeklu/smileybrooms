"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
  Search,
  User,
  ShoppingCart,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import CartButton from "./cart-button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

// Define navigation items with their paths and icons
const navigationItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Phone },
  { name: "Pricing", path: "/pricing", icon: Calculator },
  { name: "Careers", path: "/careers", icon: Briefcase },
]

// Define services submenu items
const servicesItems = [
  {
    name: "Home Cleaning",
    path: "/services/home",
    description: "Professional cleaning services for your home",
    icon: "🏠",
  },
  {
    name: "Office Cleaning",
    path: "/services/office",
    description: "Keep your workspace spotless and professional",
    icon: "🏢",
  },
  {
    name: "Deep Cleaning",
    path: "/services/deep",
    description: "Thorough cleaning for those tough spots",
    icon: "✨",
  },
  {
    name: "Move-in/Move-out",
    path: "/services/moving",
    description: "Fresh start for your new space",
    icon: "📦",
  },
]

export default function EnhancedNavigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Demo state

  // Filter out the current page from navigation items
  const filteredNavigationItems = navigationItems.filter((item) => item.path !== pathname)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isSearchOpen])

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo search functionality
    console.log("Search submitted:", searchInputRef.current?.value)
    setIsSearchOpen(false)
  }

  // Handle escape key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSearchOpen])

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : pathname === "/"
            ? "bg-transparent"
            : "bg-background/95 backdrop-blur-md",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" aria-label="Homepage">
              <Logo className="h-8 w-auto" />
            </Link>

            {/* Desktop Navigation Menu */}
            <NavigationMenu className="hidden lg:flex ml-6">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === "/" && "bg-accent text-accent-foreground",
                      )}
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {servicesItems.map((item) => (
                        <li key={item.path}>
                          <Link href={item.path} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                pathname === item.path && "bg-accent text-accent-foreground",
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{item.icon}</span>
                                <div>
                                  <div className="text-sm font-medium leading-none">{item.name}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {filteredNavigationItems.slice(1, 4).map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link href={item.path} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          pathname === item.path && "bg-accent text-accent-foreground",
                        )}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="rounded-full w-9 h-9"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full w-9 h-9"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Cart Button */}
            <CartButton />

            {/* User Menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32&query=user" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
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
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" onClick={() => setIsLoggedIn(true)} className="ml-2">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="rounded-full w-9 h-9 mr-1"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full w-9 h-9 mr-1"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <CartButton />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[350px] pr-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <Logo className="h-6 w-auto" />
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>

                  {/* Mobile User Section */}
                  <div className="mb-6">
                    {isLoggedIn ? (
                      <div className="flex items-center p-4 bg-accent/50 rounded-lg">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src="/placeholder.svg?height=40&width=40&query=user" alt="User" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => setIsLoggedIn(true)}>
                          Sign In
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Register
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="space-y-1 pr-6">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={cn(
                          "flex items-center py-3 px-3 rounded-lg text-sm font-medium transition-colors",
                          pathname === item.path ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    ))}

                    {/* Mobile Services Submenu */}
                    <div className="py-2">
                      <p className="px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                        Services
                      </p>
                      {servicesItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.path}
                          className={cn(
                            "flex items-center py-2 px-3 rounded-lg text-sm transition-colors",
                            pathname === item.path ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="mr-3 text-lg">{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="mt-auto pt-6 border-t">
                    {isLoggedIn && (
                      <Button
                        variant="outline"
                        className="w-full mb-4"
                        onClick={() => {
                          setIsLoggedIn(false)
                          setIsOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
                      <p>© 2023 Smiley Brooms</p>
                      <p>v1.0.0</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-0 bg-background/95 backdrop-blur-md shadow-lg z-50 p-4"
          >
            <div className="container mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search for services, locations..."
                  className="pr-10 py-6 text-lg"
                  autoComplete="off"
                />
                <Button type="submit" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>
              <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Home Cleaning
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Office Cleaning
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Deep Clean
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
