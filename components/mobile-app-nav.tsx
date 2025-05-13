"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, Info, Phone, Settings, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MobileAppNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl flex items-center">
          <span className="text-primary">Smiley</span>
          <span>Brooms</span>
        </Link>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-foreground"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-foreground"
          >
            Services
          </Link>
          <Link
            href="/pricing"
            className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-foreground"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-foreground"
          >
            Contact
          </Link>
          <Link
            href="/download"
            className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-foreground"
          >
            Download
          </Link>
        </nav>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/"
              className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMenu}
            >
              <Home className="h-5 w-5 mr-3 text-primary" />
              <span>Home</span>
            </Link>
            <Link
              href="/services"
              className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMenu}
            >
              <Settings className="h-5 w-5 mr-3 text-primary" />
              <span>Services</span>
            </Link>
            <Link
              href="/pricing"
              className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMenu}
            >
              <Settings className="h-5 w-5 mr-3 text-primary" />
              <span>Pricing</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMenu}
            >
              <Info className="h-5 w-5 mr-3 text-primary" />
              <span>About</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMenu}
            >
              <Phone className="h-5 w-5 mr-3 text-primary" />
              <span>Contact</span>
            </Link>
            <Link
              href="/download"
              className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMenu}
            >
              <Download className="h-5 w-5 mr-3 text-primary" />
              <span>Download</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
