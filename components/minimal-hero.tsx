"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MinimalHero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const fullTexts = [
    "You rest, we take care of the rest!",
    "Professional cleaning at your fingertips!",
    "Sparkling clean, every time!",
    "Your home deserves the best!",
  ]
  const typingSpeed = 50
  const erasingSpeed = 30
  const pauseDuration = 2000
  const textRef = useRef(fullTexts[0])

  // Typing effect
  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping) {
      if (displayText.length < textRef.current.length) {
        timeout = setTimeout(() => {
          setDisplayText(textRef.current.substring(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false)
        }, pauseDuration)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1))
        }, erasingSpeed)
      } else {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % fullTexts.length)
        textRef.current = fullTexts[(currentTextIndex + 1) % fullTexts.length]
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isTyping, currentTextIndex, fullTexts])

  const scrollToBooking = () => {
    const calculatorSection = document.getElementById("calculator")
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: "smooth" })
    } else {
      // If calculator section doesn't exist on this page, navigate to calculator page
      window.location.href = "/calculator"
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pattern">
      {/* Background overlay with consistent opacity */}
      <div className="absolute inset-0 bg-image-overlay" />

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 animate-glow">
              Smiley Brooms
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8 h-16"
          >
            <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 typing-effect">{displayText}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button
              onClick={scrollToBooking}
              size="lg"
              className="group relative overflow-hidden rounded-full px-8 py-6 neon-button"
            >
              <span className="relative z-10 text-lg font-medium">Book Now</span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 transition-transform duration-300 group-hover:translate-y-1">
                <ArrowDown className="h-4 w-4 animate-bounce" />
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
