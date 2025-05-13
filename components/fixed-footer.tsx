"use client"

import { useState, useEffect } from "react"

export function FixedFooter() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-2 px-4 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} SmileyBrooms</p>
        <div className="flex space-x-4">
          <a href="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary">
            Terms
          </a>
          <a href="/privacy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}
