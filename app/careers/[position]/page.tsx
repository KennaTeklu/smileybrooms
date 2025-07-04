import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data for job positions
const jobPositions = [
  {
    id: "senior-software-engineer",
    title: "Senior Software Engineer",
    location: "Remote (US)",
    type: "Full-time",
    description: `We are looking for a highly skilled Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining scalable software solutions. This role requires strong problem-solving abilities and a deep understanding of modern web technologies.`,
    responsibilities: [
      "Lead the design and development of new features and services.",
      "Write clean, maintainable, and efficient code.",
      "Collaborate with product managers and other engineers to define and implement solutions.",
      "Mentor junior engineers and contribute to team growth.",
      "Participate in code reviews and ensure code quality.",
    ],
    requirements: [
      "Bachelor's or Master's degree in Computer Science or a related field.",
      "5+ years of experience in software development.",
      "Proficiency in React, Next.js, and TypeScript.",
      "Experience with cloud platforms (AWS, Azure, GCP) and microservices architecture.",
      "Strong understanding of data structures, algorithms, and software design principles.",
    ],
    benefits: [
      "Competitive salary and equity.",
      "Comprehensive health, dental, and vision insurance.",
      "Unlimited paid time off.",
      "Professional development opportunities.",
      "Remote-first culture with flexible working hours.",
    ],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    location: "New York, NY",
    type: "Full-time",
    description: `As a Product Manager, you will be the voice of the customer, defining product strategy and roadmap. You will work closely with engineering, design, and marketing teams to deliver innovative products that meet market needs.`,
    responsibilities: [
      "Define and communicate product vision, strategy, and roadmap.",
      "Conduct market research and competitive analysis.",
      "Gather and prioritize product requirements from various stakeholders.",
      "Work with engineering and design to ensure successful product delivery.",
      "Monitor product performance and identify areas for improvement.",
    ],
    requirements: [
      "Bachelor's degree in Business, Computer Science, or a related field.",
      "3+ years of experience in product management.",
      "Proven track record of launching successful products.",
      "Excellent communication, interpersonal, and presentation skills.",
      "Ability to thrive in a fast-paced, agile environment.",
    ],
    benefits: [
      "Competitive salary and bonus.",
      "Health and wellness programs.",
      "Generous paid time off.",
      "Opportunities for career growth.",
      "Dynamic and collaborative work environment.",
    ],
  },
  {
    id: "ux-ui-designer",
    title: "UX/UI Designer",
    location: "Remote (Europe)",
    type: "Full-time",
    description: `We are seeking a talented UX/UI Designer to create intuitive and visually appealing user interfaces. You will be involved in every stage of the design process, from user research to prototyping and final implementation.`,
    responsibilities: [
      "Conduct user research, create user personas, and map user journeys.",
      "Design wireframes, mockups, and prototypes.",
      "Develop high-fidelity UI designs and design systems.",
      "Collaborate with engineers to ensure design feasibility and implementation accuracy.",
      "Iterate on designs based on user feedback and usability testing.",
    ],
    requirements: [
      "Bachelor's degree in Design, Human-Computer Interaction, or a related field.",
      "4+ years of experience in UX/UI design.",
      "Proficiency in design tools such as Figma, Sketch, or Adobe XD.",
      "Strong portfolio showcasing a range of UX/UI projects.",
      "Understanding of user-centered design principles and best practices.",
    ],
    benefits: [
      "Competitive salary.",
      "Flexible working hours.",
      "Professional development budget.",
      "Opportunity to work on impactful projects.",
      "Supportive and creative team environment.",
    ],
  },
]

export default function CareerPositionPage({ params }: { params: { position: string } }) {
  const { position: positionId } = params
  const job = jobPositions.find((p) => p.id === positionId)

  if (!job) {
    notFound() // Render 404 page if position not found
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/careers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Careers
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {job.location} &bull; {job.type}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Job Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{job.description}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-3">Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {job.responsibilities.map((res, index) => (
                <li key={index}>{res}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-3">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-3">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" className="px-8 py-3 text-lg">
              Apply Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
