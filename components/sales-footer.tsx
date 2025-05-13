"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"

// Define company info directly in the component instead of importing
const COMPANY_INFO = {
  phone: "1-800-CLEANING",
  email: "info@smileybrooms.com",
  address: "123 Cleaning Ave, Suite 100, San Francisco, CA 94103",
  socialMedia: {
    facebook: "https://facebook.com/smileybrooms",
    instagram: "https://instagram.com/smileybrooms",
    twitter: "https://twitter.com/smileybrooms",
  },
}

export function SalesFooter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
    // Show success message or toast
  }

  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Services",
      links: [
        { label: "Home Cleaning", href: "/services/home" },
        { label: "Deep Cleaning", href: "/services/deep" },
        { label: "Move In/Out", href: "/services/move" },
        { label: "Office Cleaning", href: "/services/office" },
        { label: "Carpet Cleaning", href: "/services/carpet" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Press", href: "/press" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Cleaning Tips", href: "/resources/tips" },
        { label: "FAQ", href: "/faq" },
        { label: "Pricing", href: "/pricing" },
        { label: "Download App", href: "/download" },
        { label: "Become a Cleaner", href: "/careers/cleaner" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Security", href: "/security" },
        { label: "Accessibility", href: "/accessibility" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: COMPANY_INFO.socialMedia.facebook, label: "Facebook" },
    { icon: Instagram, href: COMPANY_INFO.socialMedia.instagram, label: "Instagram" },
    { icon: Twitter, href: COMPANY_INFO.socialMedia.twitter, label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ]

  const contactInfo = [
    { icon: Phone, info: COMPANY_INFO.phone, href: `tel:${COMPANY_INFO.phone}` },
    { icon: Mail, info: COMPANY_INFO.email, href: `mailto:${COMPANY_INFO.email}` },
    { icon: MapPin, info: COMPANY_INFO.address, href: `https://maps.google.com/?q=${COMPANY_INFO.address}` },
  ]

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      {/* Pre-footer CTA */}
      <div className="bg-primary-50 dark:bg-primary-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Ready to experience a cleaner home?</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Book your first cleaning service today.</p>
            </div>
            <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700 text-white group">
              <Link href="/pricing">
                Book Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <Logo className="h-8 w-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              SmileyBrooms provides professional cleaning services for homes and offices. We bring sparkle to your space
              and joy to your day.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-start text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                >
                  <item.icon className="h-5 w-5 mr-3 mt-0.5" />
                  <span>{item.info}</span>
                </a>
              ))}
            </div>

            {/* Social links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-700 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li key={linkIndex} whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Subscribe to our newsletter</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get the latest cleaning tips, exclusive offers, and updates delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow"
                required
              />
              <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {currentYear} SmileyBrooms. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm"
            >
              Cookies
            </Link>
            <Link
              href="/sitemap"
              className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 text-sm"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
