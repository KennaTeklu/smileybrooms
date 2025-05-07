"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TechnologyVersion {
  name: string
  version: string
  status: "stable" | "rc" | "beta" | "alpha"
  description: string
  releaseDate?: string
  docsUrl: string
  repoUrl: string
  changelogUrl?: string
}

const technologies: TechnologyVersion[] = [
  {
    name: "Next.js",
    version: "15.0.0",
    status: "stable",
    description: "The React framework for the web. Used for server-side rendering and static site generation.",
    releaseDate: "2023-10-26",
    docsUrl: "https://nextjs.org/docs",
    repoUrl: "https://github.com/vercel/next.js",
    changelogUrl: "https://github.com/vercel/next.js/releases",
  },
  {
    name: "Tailwind CSS",
    version: "4.0.0",
    status: "stable",
    description: "A utility-first CSS framework. Version 4 introduces a new class naming convention.",
    releaseDate: "2023-11-02",
    docsUrl: "https://tailwindcss.com/docs",
    repoUrl: "https://github.com/tailwindlabs/tailwindcss",
    changelogUrl: "https://github.com/tailwindlabs/tailwindcss/releases",
  },
  {
    name: "React",
    version: "18.2.0",
    status: "stable",
    description: "A JavaScript library for building user interfaces. The foundation of our frontend.",
    releaseDate: "2022-06-14",
    docsUrl: "https://react.dev/",
    repoUrl: "https://github.com/facebook/react",
    changelogUrl: "https://github.com/facebook/react/releases",
  },
  {
    name: "TypeScript",
    version: "5.3.0",
    status: "stable",
    description: "A typed superset of JavaScript that compiles to plain JavaScript.",
    releaseDate: "2023-11-01",
    docsUrl: "https://www.typescriptlang.org/docs/",
    repoUrl: "https://github.com/microsoft/TypeScript",
    changelogUrl: "https://github.com/microsoft/TypeScript/releases",
  },
  {
    name: "shadcn/ui",
    version: "0.8.0",
    status: "stable",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
    docsUrl: "https://ui.shadcn.com/",
    repoUrl: "https://github.com/shadcn/ui",
  },
]

export function TechVersionsInfo() {
  const [expandedTech, setExpandedTech] = useState<string | null>(null)

  const toggleExpand = (techName: string) => {
    setExpandedTech(expandedTech === techName ? null : techName)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "bg-green-500 hover:bg-green-600"
      case "rc":
        return "bg-blue-500 hover:bg-blue-600"
      case "beta":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "alpha":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="space-y-4">
      {technologies.map((tech) => (
        <Card key={tech.name} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>{tech.name}</CardTitle>
                <Badge className={getStatusColor(tech.status)}>v{tech.version}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(tech.name)}
                aria-expanded={expandedTech === tech.name}
                aria-controls={`tech-details-${tech.name}`}
              >
                {expandedTech === tech.name ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            <CardDescription>{tech.description}</CardDescription>
          </CardHeader>
          {expandedTech === tech.name && (
            <CardContent id={`tech-details-${tech.name}`} className="pt-2">
              <div className="space-y-2 text-sm">
                {tech.releaseDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Release Date:</span>
                    <span>{tech.releaseDate}</span>
                  </div>
                )}
                <div className="flex flex-col gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="justify-start">
                    <a
                      href={tech.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Documentation
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="justify-start">
                    <a
                      href={tech.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Repository
                    </a>
                  </Button>
                  {tech.changelogUrl && (
                    <Button asChild variant="outline" size="sm" className="justify-start">
                      <a
                        href={tech.changelogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Changelog
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
