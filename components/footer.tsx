"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function Footer() {
  const { toast } = useToast()

  const handleFeatureComingSoon = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "This feature is under development and will be available shortly.",
      variant: "default",
    })
  }

  return (
    <footer className="bg-gray-100 p-6 md:py-12 w-full dark:bg-gray-800">
      <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
        <div className="grid gap-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Company</h3>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            About Us
          </Link>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Our Team
          </Link>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Careers
          </Link>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            News
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Services</h3>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Residential Cleaning
          </Link>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Commercial Cleaning
          </Link>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Deep Cleaning
          </Link>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Move-in/out Cleaning
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Legal</h3>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Privacy Policy
          </Link>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Cookie Policy
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Connect</h3>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Contact
          </Link>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            Support
          </Link>
          <Link className="text-gray-600 hover:underline dark:text-gray-400" href="#">
            FAQ
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Follow Us</h3>
          <div className="flex space-x-4">
            <button onClick={handleFeatureComingSoon} aria-label="Facebook">
              <Facebook className="h-5 w-5 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" />
            </button>
            <button onClick={handleFeatureComingSoon} aria-label="Twitter">
              <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-300" />
            </button>
            <button onClick={handleFeatureComingSoon} aria-label="Instagram">
              <Instagram className="h-5 w-5 text-gray-600 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400" />
            </button>
            <button onClick={handleFeatureComingSoon} aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500" />
            </button>
            <button onClick={handleFeatureComingSoon} aria-label="YouTube">
              <Youtube className="h-5 w-5 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500" />
            </button>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-4">Newsletter</h3>
          <p className="text-gray-600 dark:text-gray-400">Subscribe to our newsletter for updates.</p>
          <div className="flex gap-2 mt-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleFeatureComingSoon}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl mt-8 text-center text-gray-500 dark:text-gray-400">
        © 2023 Smiley Brooms. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
