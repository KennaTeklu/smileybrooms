"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbProps {
  className?: string
  homeElement?: React.ReactNode
  separator?: React.ReactNode
  containerClasses?: string
  listClasses?: string
  activeItemClasses?: string
  capitalizeLinks?: boolean
}

export function Breadcrumb({
  className,
  homeElement,
  separator = <ChevronRight className="h-4 w-4" />,
  containerClasses,
  listClasses,
  activeItemClasses = "text-gray-500 dark:text-gray-400",
  capitalizeLinks = true,
}: BreadcrumbProps) {
  const paths = usePathname()
  const pathNames = paths.split("/").filter((path) => path)

  return (
    <nav aria-label="Breadcrumb" className={cn("py-3 text-sm", containerClasses, className)}>
      <ol className={cn("flex items-center space-x-1", listClasses)}>
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors"
          >
            {homeElement || <Home className="h-4 w-4" />}
          </Link>
        </li>

        {pathNames.length > 0 && (
          <li className="flex items-center">
            <span className="mx-1 text-gray-400">{separator}</span>
          </li>
        )}

        {pathNames.map((name, index) => {
          const routeTo = `/${pathNames.slice(0, index + 1).join("/")}`
          const isLast = index === pathNames.length - 1
          const displayName = capitalizeLinks
            ? name
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : name

          return (
            <li key={routeTo} className="flex items-center">
              {isLast ? (
                <span className={cn("", activeItemClasses)}>{displayName}</span>
              ) : (
                <>
                  <Link
                    href={routeTo}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors"
                  >
                    {displayName}
                  </Link>
                  <span className="mx-1 text-gray-400">{separator}</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
