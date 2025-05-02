"use client"

import type React from "react"

import { useRef, useState, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TikTokScrollProps {
  pages: ReactNode[]
  className?: string
}

export function TikTokScroll({ pages, className }: TikTokScrollProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isScrolling, setIsScrolling] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  // Set up scroll event listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isScrolling) return

      setIsScrolling(true)

      if (e.deltaY > 0 && currentPage < pages.length - 1) {
        // Scroll down
        setCurrentPage((prev) => prev + 1)
      } else if (e.deltaY < 0 && currentPage > 0) {
        // Scroll up
        setCurrentPage((prev) => prev - 1)
      }

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 1000) // Debounce scrolling
    }

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
      clearTimeout(scrollTimeout)
    }
  }, [currentPage, isScrolling, pages.length])

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || isScrolling) return

    const touchEnd = e.touches[0].clientY
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      // Threshold for swipe
      setIsScrolling(true)

      if (diff > 0 && currentPage < pages.length - 1) {
        // Swipe up
        setCurrentPage((prev) => prev + 1)
      } else if (diff < 0 && currentPage > 0) {
        // Swipe down
        setCurrentPage((prev) => prev - 1)
      }

      setTouchStart(null)
      setTimeout(() => {
        setIsScrolling(false)
      }, 1000)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return

      if (e.key === "ArrowDown" && currentPage < pages.length - 1) {
        e.preventDefault()
        setIsScrolling(true)
        setCurrentPage((prev) => prev + 1)
        setTimeout(() => setIsScrolling(false), 1000)
      } else if (e.key === "ArrowUp" && currentPage > 0) {
        e.preventDefault()
        setIsScrolling(true)
        setCurrentPage((prev) => prev - 1)
        setTimeout(() => setIsScrolling(false), 1000)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, isScrolling, pages.length])

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full overflow-hidden", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {pages.map((page, index) => (
        <div
          key={index}
          ref={(el) => (pageRefs.current[index] = el)}
          className={cn(
            "absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out",
            index === currentPage ? "translate-y-0" : index < currentPage ? "-translate-y-full" : "translate-y-full",
          )}
        >
          {page}
        </div>
      ))}

      {/* Navigation dots */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {pages.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentPage ? "bg-primary scale-125" : "bg-gray-300 hover:bg-gray-400",
            )}
            onClick={() => {
              if (!isScrolling) {
                setIsScrolling(true)
                setCurrentPage(index)
                setTimeout(() => setIsScrolling(false), 1000)
              }
            }}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
