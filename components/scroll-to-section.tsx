"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  label: string
}

interface ScrollToSectionProps {
  sections: Section[]
  offset?: number
  className?: string
  activeClassName?: string
  containerClassName?: string
}

export function ScrollToSection({
  sections,
  offset = 100,
  className,
  activeClassName = "text-primary border-primary",
  containerClassName,
}: ScrollToSectionProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset

      const currentSection =
        sections
          .map((section) => {
            const element = document.getElementById(section.id)
            if (!element) return { id: section.id, position: -1 }
            return {
              id: section.id,
              position: element.offsetTop,
            }
          })
          .filter((section) => section.position !== -1)
          .sort((a, b) => a.position - b.position)
          .find((section) => section.position >= scrollPosition) || null

      if (currentSection) {
        setActiveSection(currentSection.id)
      } else if (sections.length > 0) {
        // If we're at the bottom of the page, highlight the last section
        setActiveSection(sections[sections.length - 1].id)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections, offset])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const topPosition = element.offsetTop - offset + 20
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div
      className={cn(
        "flex overflow-x-auto py-2 sticky top-16 bg-white/95 dark:bg-gray-950/95 z-40 backdrop-blur-md border-b",
        containerClassName,
      )}
    >
      <div className="flex space-x-2 px-4 mx-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "px-3 py-1.5 text-sm whitespace-nowrap border-b-2 border-transparent transition-colors",
              activeSection === section.id
                ? activeClassName
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
              className,
            )}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  )
}
