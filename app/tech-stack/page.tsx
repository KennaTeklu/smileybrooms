import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Code, Database, Cloud, Layout, Zap, GitBranch } from "lucide-react"

export default function TechStackPage() {
  const techCategories = [
    {
      name: "Frontend",
      icon: Layout,
      technologies: [
        { name: "React", description: "A JavaScript library for building user interfaces." },
        { name: "Next.js", description: "React framework for production-grade applications." },
        { name: "TypeScript", description: "Typed superset of JavaScript that compiles to plain JavaScript." },
        { name: "Tailwind CSS", description: "A utility-first CSS framework for rapid UI development." },
        { name: "Framer Motion", description: "A production-ready motion library for React." },
        { name: "Shadcn UI", description: "Reusable components built with Radix UI and Tailwind CSS." },
      ],
    },
    {
      name: "Backend & API",
      icon: Code,
      technologies: [
        { name: "Next.js API Routes", description: "Serverless functions for building APIs with Next.js." },
        { name: "Node.js", description: "JavaScript runtime for server-side logic." },
        { name: "Web Workers", description: "Offloading heavy computations to background threads." },
        { name: "Stripe", description: "Payment processing platform for online transactions." },
        { name: "Vercel AI SDK", description: "Toolkit for building AI-powered applications." },
      ],
    },
    {
      name: "Database & Storage",
      icon: Database,
      technologies: [
        { name: "PostgreSQL", description: "Powerful, open-source relational database system." },
        { name: "Vercel Postgres", description: "Serverless Postgres database for Vercel deployments." },
        {
          name: "Redis (Upstash)",
          description: "In-memory data structure store, used for caching and real-time data.",
        },
        { name: "Vercel Blob", description: "Fast, scalable, and cost-effective object storage." },
      ],
    },
    {
      name: "Deployment & Hosting",
      icon: Cloud,
      technologies: [
        {
          name: "Vercel",
          description: "Platform for frontend developers, providing global deployment and serverless functions.",
        },
        { name: "Git (GitHub)", description: "Version control system for tracking changes in source code." },
        { name: "CI/CD", description: "Automated pipelines for continuous integration and deployment." },
      ],
    },
    {
      name: "Monitoring & Analytics",
      icon: Zap,
      technologies: [
        { name: "Vercel Analytics", description: "Real-time insights into website performance and traffic." },
        { name: "Sentry", description: "Error monitoring and performance monitoring platform." },
      ],
    },
    {
      name: "Development Tools",
      icon: GitBranch,
      technologies: [
        { name: "VS Code", description: "Popular code editor with extensive extensions." },
        { name: "ESLint", description: "Pluggable linting utility for JavaScript and JSX." },
        { name: "Prettier", description: "An opinionated code formatter." },
        { name: "Zod", description: "TypeScript-first schema declaration and validation library." },
      ],
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Our Technology Stack</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
        We leverage modern and robust technologies to build a fast, scalable, and reliable platform.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {techCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <Card key={index} className="shadow-lg">
              <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                <Icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl font-semibold">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.technologies.map((tech, techIndex) => (
                  <div key={techIndex}>
                    <h3 className="font-semibold text-lg">{tech.name}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{tech.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Separator className="my-12" />

      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Why This Stack?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Our choices are driven by performance, developer experience, scalability, and community support, ensuring we
          can deliver the best possible service to our users.
        </p>
      </div>
    </div>
  )
}
