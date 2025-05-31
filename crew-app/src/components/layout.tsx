"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Home, Briefcase, User, LifeBuoy, LogOut } from "lucide-react"
import { Button } from "@/crew-app/src/components/ui/button"
import { cn } from "@/crew-app/src/lib/utils"

interface LayoutProps {
  children: React.ReactNode
}

export default function CleanerPortalLayout({ children }: LayoutProps) {
  const router = useRouter()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/jobs/today", icon: Briefcase, label: "Jobs" }, // Placeholder for jobs list
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/support", icon: LifeBuoy, label: "Support" },
  ]

  const handleLogout = () => {
    // In a real app, clear authentication tokens/cookies
    console.log("Logging out...")
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-40 w-full border-b bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            SmileyBrooms Crew
          </Link>
          <nav className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                  router.pathname === item.href
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                    : "text-gray-600 dark:text-gray-400",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
          {/* Mobile navigation toggle would go here */}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-white p-4 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        &copy; {new Date().getFullYear()} SmileyBrooms Crew. All rights reserved.
      </footer>
    </div>
  )
}
