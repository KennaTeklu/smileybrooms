"use client"

import Link from "next/link"

type MegaMenuItem = {
  name: string
  path: string
}

type MegaMenuSection = {
  title: string
  items: MegaMenuItem[]
}

interface MegaMenuProps {
  sections: MegaMenuSection[]
  onClose: () => void
}

export function MegaMenu({ sections, onClose }: MegaMenuProps) {
  return (
    <div
      className="absolute top-full left-0 w-screen max-w-4xl bg-white dark:bg-gray-950 shadow-lg rounded-b-lg border dark:border-gray-800 mt-1 z-50 overflow-hidden"
      onMouseEnter={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {sections.map((section) => (
          <div
            key={section.title}
            className="p-4 border-b md:border-b-0 md:border-r dark:border-gray-800 last:border-r-0"
          >
            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-foreground transition-colors"
                    onClick={onClose}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Need help choosing a service?</p>
          <Link
            href="/contact"
            className="text-sm font-medium text-primary hover:text-primary/80 dark:text-primary-foreground"
            onClick={onClose}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
