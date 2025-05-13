"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TechVersionsInfo() {
  const [versions, setVersions] = useState({
    nextjs: "14.0.4",
    react: "18.2.0",
    tailwind: "3.4.0",
    typescript: "5.3.3",
    shadcn: "0.5.0",
  })

  useEffect(() => {
    // In a real app, you might fetch this data from an API
    console.log("Tech versions component mounted")
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Next.js</CardTitle>
          <CardDescription>The React Framework for the Web</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span>Version</span>
            <Badge variant="outline">{versions.nextjs}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>React</CardTitle>
          <CardDescription>A JavaScript library for building user interfaces</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span>Version</span>
            <Badge variant="outline">{versions.react}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tailwind CSS</CardTitle>
          <CardDescription>A utility-first CSS framework</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span>Version</span>
            <Badge variant="outline">{versions.tailwind}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>TypeScript</CardTitle>
          <CardDescription>JavaScript with syntax for types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span>Version</span>
            <Badge variant="outline">{versions.typescript}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>shadcn/ui</CardTitle>
          <CardDescription>UI components built with Radix UI and Tailwind</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span>Version</span>
            <Badge variant="outline">{versions.shadcn}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
