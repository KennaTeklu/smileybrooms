"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageFlipperProps {
  pages: {
    id: string
    content: ReactNode
  }[]
}

export function PageFlipper({ pages }: PageFlipperProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return

      setIsScrolling(true)

      if (e.deltaY > 0 && currentPage < pages.length - 1) {
        // Scroll down
        setCurrentPage((prev) => prev + 1)
      } else if (e.deltaY < 0 && currentPage > 0) {
        // Scroll up
        setCurrentPage((prev) => prev - 1)
      }

      timeout = setTimeout(() => {
        setIsScrolling(false)
      }, 800) // Debounce scrolling
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return

      if ((e.key === "ArrowDown" || e.key === "PageDown") && currentPage < pages.length - 1) {
        setIsScrolling(true)
        setCurrentPage((prev) => prev + 1)

        setTimeout(() => {
          setIsScrolling(false)
        }, 800)
      } else if ((e.key === "ArrowUp" || e.key === "PageUp") && currentPage > 0) {
        setIsScrolling(true)
        setCurrentPage((prev) => prev - 1)

        setTimeout(() => {
          setIsScrolling(false)
        }, 800)
      }
    }

    window.addEventListener("wheel", handleWheel)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
      clearTimeout(timeout)
    }
  }, [currentPage, isScrolling, pages.length])

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || isScrolling) return

    const touchEnd = e.changedTouches[0].clientY
    const diff = touchStart - touchEnd

    if (Math.abs(diff) < 50) return // Minimum swipe distance

    setIsScrolling(true)

    if (diff > 0 && currentPage < pages.length - 1) {
      // Swipe up
      setCurrentPage((prev) => prev + 1)
    } else if (diff < 0 && currentPage > 0) {
      // Swipe down
      setCurrentPage((prev) => prev - 1)
    }

    setTimeout(() => {
      setIsScrolling(false)
    }, 800)

    setTouchStart(null)
  }

  // Navigation dots
  const handleDotClick = (index: number) => {
    setCurrentPage(index)
  }

  return (
    <div
      className="relative h-[calc(100vh-8rem)] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {pages.map((page, index) => (
        <div
          key={page.id}
          className={cn(
            "absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out overflow-y-auto px-4 py-8",
            index === currentPage ? "translate-y-0" : index < currentPage ? "-translate-y-full" : "translate-y-full",
          )}
          aria-hidden={index !== currentPage}
        >
          {page.content}
        </div>
      ))}

      {/* Navigation dots */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentPage
                ? "bg-primary scale-125"
                : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500",
            )}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-500 dark:text-gray-400">
        {currentPage + 1} / {pages.length}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => !isScrolling && currentPage > 0 && setCurrentPage((prev) => prev - 1)}
        className={cn(
          "absolute left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md transition-opacity",
          currentPage === 0 || isScrolling ? "opacity-30 cursor-not-allowed" : "opacity-70 hover:opacity-100",
        )}
        disabled={currentPage === 0 || isScrolling}
        aria-label="Previous page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={() => !isScrolling && currentPage < pages.length - 1 && setCurrentPage((prev) => prev + 1)}
        className={cn(
          "absolute right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-md transition-opacity",
          currentPage === pages.length - 1 || isScrolling
            ? "opacity-30 cursor-not-allowed"
            : "opacity-70 hover:opacity-100",
        )}
        disabled={currentPage === pages.length - 1 || isScrolling}
        aria-label="Next page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
