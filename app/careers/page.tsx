import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Clock } from "lucide-react"

// Mock data for job positions
const jobPositions = [
  {
    id: "senior-software-engineer",
    title: "Senior Software Engineer",
    location: "Remote (US)",
    type: "Full-time",
    description: "Design, develop, and maintain scalable software solutions for our platform.",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    location: "New York, NY",
    type: "Full-time",
    description: "Define product strategy and roadmap, working closely with engineering and design.",
  },
  {
    id: "ux-ui-designer",
    title: "UX/UI Designer",
    location: "Remote (Europe)",
    type: "Full-time",
    description: "Create intuitive and visually appealing user interfaces for our web and mobile applications.",
  },
  {
    id: "customer-support-specialist",
    title: "Customer Support Specialist",
    location: "Remote (Global)",
    type: "Part-time",
    description: "Provide excellent customer service and support to our users.",
  },
  {
    id: "marketing-manager",
    title: "Marketing Manager",
    location: "Los Angeles, CA",
    type: "Full-time",
    description: "Develop and execute marketing strategies to drive brand awareness and customer acquisition.",
  },
]

export default function CareersPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Join Our Team</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
        Explore exciting career opportunities at SmileyBrooms and help us build the future of cleaning services.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {jobPositions.map((job) => (
          <Card key={job.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">{job.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="h-4 w-4 mr-1" /> {job.location}
                <span className="mx-2">&bull;</span>
                <Clock className="h-4 w-4 mr-1" /> {job.type}
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-gray-700 dark:text-gray-300 mb-4">{job.description}</p>
              <Button asChild className="w-full">
                <Link href={`/careers/${job.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Don't see a role that fits?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>{" "}
          to learn more about future opportunities.
        </p>
      </div>
    </div>
  )
}
