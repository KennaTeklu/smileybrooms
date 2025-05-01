"use client"

import type React from "react"

import { useState, useEffect, useRef, type ReactNode, useCallback } from "react"
import { cn } from "@/lib/utils"

interface PageFlipperProps {
  pages: {
    id: string
    content: ReactNode
  }[]
}

// Throttle function
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number
  return function (this: any, ...args: Parameters<T>): ReturnType<T> | void {
    if (!inThrottle) {
      func.apply(this, args)
      lastRan = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan),
      )
    }
  } as T
}

export function PageFlipper({ pages }: PageFlipperProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

  // Reset page refs when pages change
  useEffect(() => {
    pageRefs.current = pageRefs.current.slice(0, pages.length)
  }, [pages.length])

  const goToNextPage = useCallback(() => {
    if (!isScrolling && currentPage < pages.length - 1) {
      setIsScrolling(true)
      setCurrentPage((prev) => prev + 1)
      setTimeout(() => {
        setIsScrolling(false)
      }, 800)
    }
  }, [currentPage, isScrolling, pages.length])

  const goToPrevPage = useCallback(() => {
    if (!isScrolling && currentPage > 0) {
      setIsScrolling(true)
      setCurrentPage((prev) => prev - 1)
      setTimeout(() => {
        setIsScrolling(false)
      }, 800)
    }
  }, [currentPage, isScrolling])

  useEffect(() => {
    const handleResize = () => {
      // Force recalculation of page heights on resize
      setCurrentPage(currentPage)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [currentPage])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault()
        return
      }

      // Get the current page element
      const currentPageElement = pageRefs.current[currentPage]

      if (currentPageElement) {
        const isScrollable = currentPageElement.scrollHeight > currentPageElement.clientHeight
        const isScrolledToBottom =
          Math.abs(currentPageElement.scrollHeight - currentPageElement.scrollTop - currentPageElement.clientHeight) < 5
        const isScrolledToTop = currentPageElement.scrollTop <= 5

        // If scrolling down and not at bottom of scrollable content, let the default scroll happen
        if (e.deltaY > 0 && isScrollable && !isScrolledToBottom) {
          return
        }

        // If scrolling up and not at top of scrollable content, let the default scroll happen
        if (e.deltaY < 0 && isScrollable && !isScrolledToTop) {
          return
        }

        // Prevent default only when we're going to change pages
        if ((e.deltaY > 0 && currentPage < pages.length - 1) || (e.deltaY < 0 && currentPage > 0)) {
          e.preventDefault()
        }
      }

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

    const handleScroll = throttle((e) => {
      // Prevent default only during active scrolling
      if (isScrolling) {
        e.preventDefault()
      }

      // Rest of the scroll handling logic
    }, 100)

    window.addEventListener("wheel", handleWheel, { passive: false })
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

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default touch move behavior when we're going to change pages
    if (isScrolling) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || isScrolling) return

    const touchEnd = e.changedTouches[0].clientY
    const diff = touchStart - touchEnd

    if (Math.abs(diff) < 50) return // Minimum swipe distance

    // Get the current page element
    const currentPageElement = pageRefs.current[currentPage]

    if (currentPageElement) {
      const isScrollable = currentPageElement.scrollHeight > currentPageElement.clientHeight
      const isScrolledToBottom =
        Math.abs(currentPageElement.scrollHeight - currentPageElement.scrollTop - currentPageElement.clientHeight) < 5
      const isScrolledToTop = currentPageElement.scrollTop <= 5

      // If swiping up and not at bottom of scrollable content, let the default scroll happen
      if (diff > 0 && isScrollable && !isScrolledToBottom) return

      // If swiping down and not at top of scrollable content, let the default scroll happen
      if (diff < 0 && isScrollable && !isScrolledToTop) return
    }

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

  useEffect(() => {
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      const diff = touchStartY - touchY

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToNextPage()
        } else {
          goToPrevPage()
        }
        touchStartY = touchY
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [goToNextPage, goToPrevPage])

  // Navigation dots
  const handleDotClick = (index: number) => {
    setCurrentPage(index)
  }

  return (
    <div
      className="relative h-[calc(100vh-8rem)] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pages.map((page, index) => (
        <div
          key={page.id}
          ref={(el) => (pageRefs.current[index] = el)}
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
