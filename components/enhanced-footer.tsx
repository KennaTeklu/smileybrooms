"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown, Phone, Mail, MapPin, ExternalLink } from "lucide-react"
import Logo from "@/components/logo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FooterSection {
  title: string
  links: {
    label: string
    href: string
    external?: boolean
    badge?: string
  }[]
}

const footerSections: FooterSection[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers", badge: "Hiring" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Home Cleaning", href: "/services/home" },
      { label: "Office Cleaning", href: "/services/office" },
      { label: "Deep Cleaning", href: "/services/deep" },
      { label: "Move-in/Move-out", href: "/services/moving" },
      { label: "Specialty Services", href: "/services/specialty" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Cleaning Guides", href: "/guides" },
      { label: "FAQ", href: "/faq" },
      { label: "Service Areas", href: "/locations" },
      { label: "Pricing", href: "/pricing" },
      { label: "Gift Cards", href: "/gift-cards", badge: "New" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
]

export default function EnhancedFooter() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      setEmail("")
    }, 1500)
  }

  return (
    <footer className="bg-background border-t relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark" />
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Footer header with logo and toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Logo className="h-8 w-auto" iconOnly={false} />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
            aria-expanded={isExpanded}
            aria-controls="footer-content"
          >
            {isExpanded ? "Collapse footer" : "Expand footer"}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Expandable Content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              id="footer-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Desktop Footer Navigation */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 col-span-full">
                  {footerSections.map((section) => (
                    <div key={section.title}>
                      <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                      <ul className="space-y-3">
                        {section.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className={cn(
                                "text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center",
                                link.external && "group"
                              )}
                              target={link.external ? "_blank" : undefined}
                              rel={link.external ? "noopener noreferrer" : undefined}
                            >
                              {link.label}
                              {link.badge && (
                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                  {link.badge}
                                </span>
                              )}
                              {link.external && (
                                <ExternalLink className="ml-1 h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Mobile Accordion Navigation */}
                <div className="md:hidden w-full">
                  <Accordion type="multiple" className="w-full">
                    {footerSections.map((section) => (
                      <AccordionItem key={section.title} value={section.title}>
                        <AccordionTrigger className="text-base">{section.title}</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-3 py-2">
                            {section.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                                  target={link.external ? "_blank" : undefined}
                                  rel={link.external ? "noopener noreferrer" : undefined}
                                >
                                  {link.label}
                                  {link.badge && (
                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                      {link.badge}
                                    </span>
                                  )}
                                  {link.external && <ExternalLink className="ml-1 h-3 w-3 opacity-70" />}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                
                {/* Contact and Newsletter Section */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
                    <ul className="space-y-3">
                      <li>
                        <a 
                          href="tel:6028000605" 
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          <span>(602) 800-0605</span>
                        </a>
                      </li>
                      <li>
                        <a 
                          href="mailto:info@smileybrooms.com" 
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          <span>info@smileybrooms.com</span>
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://maps.google.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start gap-2"
                        >
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span>
                            123 Cleaning Street<br />
                            Phoenix, AZ 85001
                          </span>\
