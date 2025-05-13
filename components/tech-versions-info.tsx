"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ExternalLink, Code, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type TechVersion = {
  name: string
  version: string
  status: "stable" | "rc" | "beta" | "alpha"
  description: string
  releaseDate?: string
  docsUrl: string
  changelogUrl?: string
  notes?: string
  icon?: React.ReactNode
}

const techVersions: TechVersion[] = [
  {
    name: "Next.js",
    version: "15.0.0",
    status: "stable",
    description: "The React framework for the web",
    releaseDate: "2025-04-15",
    docsUrl: "https://nextjs.org/docs",
    changelogUrl: "https://nextjs.org/blog",
    notes: "Introduces significant performance improvements and new features like Server Actions 2.0",
    icon: <Code className="h-5 w-5" />,
  },
  {
    name: "Tailwind CSS",
    version: "4.0.0",
    status: "stable",
    description: "A utility-first CSS framework",
    releaseDate: "2025-03-10",
    docsUrl: "https://tailwindcss.com/docs",
    changelogUrl: "https://github.com/tailwindlabs/tailwindcss/releases",
    notes: "Introduces a new class naming convention and improved performance",
    icon: <Code className="h-5 w-5" />,
  },
  {
    name: "React",
    version: "18.2.0",
    status: "stable",
    description: "A JavaScript library for building user interfaces",
    releaseDate: "2024-06-22",
    docsUrl: "https://react.dev/docs",
    changelogUrl: "https://github.com/facebook/react/releases",
    notes: "The latest stable release, with React 19 still in release candidate stage",
    icon: <Code className="h-5 w-5" />,
  },
  {
    name: "TypeScript",
    version: "5.3.0",
    status: "stable",
    description: "JavaScript with syntax for types",
    releaseDate: "2024-11-15",
    docsUrl: "https://www.typescriptlang.org/docs/",
    changelogUrl: "https://github.com/microsoft/TypeScript/releases",
    notes: "Includes improved type inference and performance enhancements",
    icon: <Code className="h-5 w-5" />,
  },
  {
    name: "shadcn/ui",
    version: "0.8.0",
    status: "stable",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS",
    releaseDate: "2024-12-01",
    docsUrl: "https://ui.shadcn.com",
    changelogUrl: "https://github.com/shadcn-ui/ui/releases",
    notes: "Includes new components and improved accessibility",
    icon: <Code className="h-5 w-5" />,
  },
]

const statusColors = {
  stable: "bg-green-500",
  rc: "bg-yellow-500",
  beta: "bg-orange-500",
  alpha: "bg-red-500",
}

const statusLabels = {
  stable: "Stable",
  rc: "Release Candidate",
  beta: "Beta",
  alpha: "Alpha",
}

export function TechVersionsInfo() {
  const [expandedTech, setExpandedTech] = useState<string | null>(null)

  const toggleExpand = (techName: string) => {
    setExpandedTech(expandedTech === techName ? null : techName)
  }

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Technology Stack</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span>Up to date</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span>Last checked: May 6, 2025</span>
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {techVersions.map((tech) => (
          <Card key={tech.name} className="overflow-hidden">
            <CardHeader
              className={cn(
                "cursor-pointer transition-colors",
                expandedTech === tech.name ? "bg-muted/50" : "hover:bg-muted/30",
              )}
              onClick={() => toggleExpand(tech.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">{tech.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{tech.name}</CardTitle>
                    <CardDescription>{tech.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold">{tech.version}</div>
                    <Badge className={cn("text-white", statusColors[tech.status])}>{statusLabels[tech.status]}</Badge>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 transition-transform",
                      expandedTech === tech.name ? "transform rotate-180" : "",
                    )}
                  />
                </div>
              </div>
            </CardHeader>

            <AnimatePresence>
              {expandedTech === tech.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {tech.notes && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Release Notes</h4>
                          <p className="text-sm text-muted-foreground">{tech.notes}</p>
                        </div>
                      )}

                      {tech.releaseDate && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">Release Date:</span>
                          <span className="text-sm text-muted-foreground">{tech.releaseDate}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-0 pb-4">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={tech.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Documentation
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    {tech.changelogUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={tech.changelogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          Changelog
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Our Update Policy</h3>
        <p className="text-sm text-muted-foreground">
          We maintain our applications with the latest stable versions of these technologies to ensure optimal
          performance, security, and feature availability. Major version updates are thoroughly tested before deployment
          to production.
        </p>
      </div>
    </div>
  )
}
