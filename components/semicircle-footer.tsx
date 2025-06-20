"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, ChevronUp, Sparkles } from "lucide-react"
import Logo from "@/components/logo"
import Link from "next/link"
import { usePathname } from "next/navigation"

const footerLinks = [
  { label: "About", href: "/about", icon: "📖" },
  { label: "Careers", href: "/careers", icon: "💼" },
  { label: "Contact", href: "/contact", icon: "📞" },
  { label: "Terms", href: "/terms", icon: "📋" },
  { label: "Pricing", href: "/pricing", icon: "💰" },
  { label: "Calculator", href: "/calculator", icon: "🧮" },
  { label: "Tech Stack", href: "/tech-stack", icon: "⚙️" },
  { label: "Download", href: "/download", icon: "📱" },
]

const socialLinks = [{ icon: Phone, href: "tel:6028000605", label: "Call Us" }]

export default function SemicircleFooter() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  // Collapse on route change
  useEffect(() => {
    setIsExpanded(false)
  }, [pathname])

  return (
    <footer className="relative bg-gradient-to-t from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Collapsed State */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center py-4"
          >
            <button
              onClick={() => setIsExpanded(true)}
              className="group relative flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 rounded-full border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              aria-label="Expand footer"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Explore More</span>
              <ChevronUp className="h-4 w-4 text-primary group-hover:animate-bounce" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded State */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.5, rotateX: -90 }}
            animate={{ height: "auto", opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ height: 0, opacity: 0, scale: 0.5, rotateX: 90 }}
            transition={{
              duration: 0.8,
              type: "spring",
              damping: 15,
              stiffness: 100,
            }}
            className="relative overflow-hidden"
            style={{
              clipPath: "ellipse(100% 70% at 50% 100%)",
              background: "radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            }}
          >
            {/* Semicircle Container */}
            <div className="relative h-80 flex items-end justify-center pb-8">
              {/* Animated Links in Semicircle */}
              {footerLinks.map((link, index) => {
                const totalElements = footerLinks.length
                const angleSpacing = 180 / (totalElements + 1) // Spread across 180 degrees with padding
                const angle = (angleSpacing * (index + 1) - 90) * (Math.PI / 180) // Convert to radians
                const radius = 140
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius * 0.6 // Flatten the semicircle

                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      type: "spring",
                      damping: 12,
                    }}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      bottom: `calc(20% + ${Math.max(y, -60)}px)`, // Prevent going below visible area
                      transform: "translateX(-50%)",
                      animation: `orbit-${index} 25s linear infinite`,
                      animationDelay: `${index * 0.8}s`,
                    }}
                  >
                    <Link
                      href={link.href}
                      className="flex flex-col items-center gap-1 p-4 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl min-w-[80px]"
                      onClick={() => setIsExpanded(false)}
                    >
                      <span className="text-xl">{link.icon}</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap text-center">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}

              {/* Center Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 360 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex flex-col items-center gap-2 p-6 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl">
                  <Logo className="h-10 w-auto" iconOnly={false} />
                  <div className="text-xs text-gray-500 dark:text-gray-400">&copy; {currentYear} Smiley Brooms</div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-3"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="p-3 rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <social.icon className="h-5 w-5 text-primary" />
                  </motion.a>
                ))}
              </motion.div>

              {/* Collapse Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110"
                aria-label="Collapse footer"
              >
                <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400 rotate-180" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        ${footerLinks
          .map((_, index) => {
            const totalElements = footerLinks.length
            const angleSpacing = 180 / (totalElements + 1)
            const startAngle = angleSpacing * (index + 1) - 90

            return `
            @keyframes orbit-${index} {
              0% {
                transform: translateX(-50%) rotate(${startAngle}deg) translateX(140px) rotate(-${startAngle}deg);
                opacity: 1;
              }
              25% {
                opacity: 1;
              }
              50% {
                transform: translateX(-50%) rotate(${startAngle + 90}deg) translateX(140px) rotate(-${startAngle + 90}deg);
                opacity: ${startAngle + 90 > 90 ? "0" : "1"};
              }
              75% {
                opacity: ${startAngle + 180 > 135 ? "0" : "1"};
              }
              100% {
                transform: translateX(-50%) rotate(${startAngle + 180}deg) translateX(140px) rotate(-${startAngle + 180}deg);
                opacity: 1;
              }
            }
          `
          })
          .join("\n")}
      `}</style>
    </footer>
  )
}
