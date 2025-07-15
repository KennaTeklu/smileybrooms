"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Code, Server, Database, Cloud, GitBranch, Package, Zap, Layout, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

interface TechItem {
  name: string
  icon: React.ElementType
  description: string
  category: string
}

const techStack: TechItem[] = [
  {
    name: "Next.js",
    icon: Layout,
    description:
      "The React framework for production, providing server-side rendering, static site generation, and more.",
    category: "Frontend Framework",
  },
  {
    name: "React",
    icon: Code,
    description:
      "A JavaScript library for building user interfaces, maintained by Facebook and a community of individual developers and companies.",
    category: "Frontend Library",
  },
  {
    name: "TypeScript",
    icon: Code,
    description:
      "A strongly typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and developer experience.",
    category: "Language",
  },
  {
    name: "Tailwind CSS",
    icon: Layout,
    description: "A utility-first CSS framework for rapidly building custom designs directly in your markup.",
    category: "Styling",
  },
  {
    name: "Shadcn UI",
    icon: Package,
    description:
      "A collection of reusable components built with Radix UI and Tailwind CSS, designed for easy customization.",
    category: "UI Library",
  },
  {
    name: "Vercel",
    icon: Cloud,
    description:
      "The platform for frontend developers, providing instant deployments, global CDN, and serverless functions.",
    category: "Deployment/Hosting",
  },
  {
    name: "Stripe",
    icon: DollarSign, // Using DollarSign for payment
    description: "A suite of APIs for online payment processing and commerce solutions.",
    category: "Payment Gateway",
  },
  {
    name: "PostgreSQL (via Neon)",
    icon: Database,
    description: "A powerful, open-source relational database system, used with Neon for serverless scaling.",
    category: "Database",
  },
  {
    name: "Prisma",
    icon: Database,
    description:
      "A next-generation ORM that makes database access easy with an auto-generated and type-safe query builder.",
    category: "ORM",
  },
  {
    name: "Zustand",
    icon: Zap,
    description: "A small, fast, and scalable bearbones state-management solution using simplified flux principles.",
    category: "State Management",
  },
  {
    name: "Framer Motion",
    icon: Zap,
    description: "A production-ready motion library for React, making it easy to create animations and gestures.",
    category: "Animation",
  },
  {
    name: "Lucide React",
    icon: Package,
    description: "A beautiful collection of open-source icons, easily customizable and tree-shakeable.",
    category: "Icons",
  },
  {
    name: "Git & GitHub",
    icon: GitBranch,
    description: "Version control system and platform for collaborative software development.",
    category: "Version Control",
  },
  {
    name: "Serverless Functions",
    icon: Server,
    description: "Backend logic deployed as functions that run on demand, managed by Vercel.",
    category: "Backend",
  },
]

export default function TechStackPage() {
  const categories = Array.from(new Set(techStack.map((item) => item.category)))

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Tech Stack</h1>
          <p className="text-xl text-muted-foreground">
            The powerful technologies that drive Smiley Brooms to deliver exceptional service.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                {category === "Frontend Framework" && <Layout className="h-7 w-7 text-blue-600" />}
                {category === "Frontend Library" && <Code className="h-7 w-7 text-purple-600" />}
                {category === "Language" && <Code className="h-7 w-7 text-yellow-600" />}
                {category === "Styling" && <Layout className="h-7 w-7 text-teal-600" />}
                {category === "UI Library" && <Package className="h-7 w-7 text-orange-600" />}
                {category === "Deployment/Hosting" && <Cloud className="h-7 w-7 text-gray-600" />}
                {category === "Payment Gateway" && <DollarSign className="h-7 w-7 text-green-600" />}
                {category === "Database" && <Database className="h-7 w-7 text-indigo-600" />}
                {category === "ORM" && <Database className="h-7 w-7 text-pink-600" />}
                {category === "State Management" && <Zap className="h-7 w-7 text-red-600" />}
                {category === "Animation" && <Zap className="h-7 w-7 text-cyan-600" />}
                {category === "Icons" && <Package className="h-7 w-7 text-lime-600" />}
                {category === "Version Control" && <GitBranch className="h-7 w-7 text-gray-600" />}
                {category === "Backend" && <Server className="h-7 w-7 text-blue-600" />}
                {category}
              </h2>
              <Separator className="mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {techStack
                  .filter((item) => item.category === category)
                  .map((item) => {
                    const Icon = item.icon
                    return (
                      <Card key={item.name} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center space-x-4">
                          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600">
                            <Icon className="h-6 w-6" />
                          </div>
                          <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{item.description}</CardDescription>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
