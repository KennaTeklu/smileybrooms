"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Briefcase, MapPin, DollarSign, Calendar, Mail } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface JobPosting {
  id: string
  title: string
  location: string
  salary: string
  type: string
  description: string[]
  responsibilities: string[]
  qualifications: string[]
  benefits: string[]
}

const jobPostings: JobPosting[] = [
  {
    id: "cleaner-specialist",
    title: "Professional Cleaning Specialist",
    location: "New York, NY",
    salary: "$20 - $25/hour",
    type: "Full-time, Part-time",
    description: [
      "Join our dynamic team as a Cleaning Specialist and help us deliver sparkling results to our clients. You will be responsible for performing high-quality cleaning services for residential and commercial properties.",
      "We are looking for individuals who are detail-oriented, reliable, and passionate about creating clean and organized spaces. Experience in professional cleaning is a plus, but we provide comprehensive training.",
    ],
    responsibilities: [
      "Perform general cleaning duties (dusting, vacuuming, mopping, sanitizing) in homes and offices.",
      "Clean and sanitize bathrooms and kitchens thoroughly.",
      "Empty trash receptacles and replace liners.",
      "Follow all safety procedures and company policies.",
      "Communicate effectively with clients and team members.",
      "Maintain cleaning equipment and supplies.",
    ],
    qualifications: [
      "High school diploma or equivalent.",
      "Previous cleaning experience preferred but not required.",
      "Ability to lift up to 25 lbs and perform physical tasks.",
      "Reliable transportation and valid driver's license.",
      "Excellent attention to detail and strong work ethic.",
      "Ability to work independently and as part of a team.",
    ],
    benefits: [
      "Competitive hourly wages.",
      "Flexible scheduling options.",
      "Paid training and professional development.",
      "Opportunity for growth within the company.",
      "Friendly and supportive work environment.",
      "Health and dental benefits (for full-time employees).",
    ],
  },
  {
    id: "operations-manager",
    title: "Operations Manager",
    location: "Brooklyn, NY",
    salary: "$60,000 - $75,000/year",
    type: "Full-time",
    description: [
      "We are seeking an experienced Operations Manager to oversee our daily cleaning operations. This role involves managing cleaning teams, optimizing schedules, ensuring quality standards, and enhancing operational efficiency.",
      "The ideal candidate will have strong leadership skills, a proven track record in operations management, and a commitment to delivering exceptional service.",
    ],
    responsibilities: [
      "Manage and supervise cleaning teams, including hiring, training, and performance evaluations.",
      "Develop and implement operational policies and procedures to improve efficiency.",
      "Oversee scheduling and dispatching of cleaning crews.",
      "Ensure high standards of cleaning quality and customer satisfaction.",
      "Manage inventory of cleaning supplies and equipment.",
      "Handle client inquiries and resolve operational issues.",
      "Analyze operational data to identify areas for improvement.",
    ],
    qualifications: [
      "Bachelor's degree in Business Administration or related field.",
      "3+ years of experience in operations management, preferably in the service industry.",
      "Strong leadership and team management skills.",
      "Excellent organizational and problem-solving abilities.",
      "Proficiency in scheduling software and Microsoft Office Suite.",
      "Ability to work in a fast-paced environment and manage multiple priorities.",
    ],
    benefits: [
      "Competitive salary and performance bonuses.",
      "Comprehensive health, dental, and vision insurance.",
      "Paid time off and holidays.",
      "Retirement savings plan with company match.",
      "Professional development opportunities.",
      "Dynamic and collaborative work environment.",
    ],
  },
  {
    id: "customer-support-rep",
    title: "Customer Support Representative",
    location: "Remote",
    salary: "$18 - $22/hour",
    type: "Full-time, Remote",
    description: [
      "As a Customer Support Representative, you will be the first point of contact for our clients, providing exceptional service and support. You will assist with booking inquiries, service adjustments, and resolving customer concerns.",
      "We are looking for empathetic and articulate individuals with a passion for helping others and a strong ability to communicate effectively.",
    ],
    responsibilities: [
      "Respond to customer inquiries via phone, email, and chat in a timely and professional manner.",
      "Assist clients with booking, rescheduling, and canceling cleaning services.",
      "Provide information about our services, pricing, and policies.",
      "Resolve customer complaints and issues with a positive and helpful attitude.",
      "Maintain accurate records of customer interactions and transactions.",
      "Collaborate with the operations team to ensure seamless service delivery.",
    ],
    qualifications: [
      "High school diploma or equivalent; some college preferred.",
      "1+ year of experience in customer service or a related field.",
      "Excellent verbal and written communication skills.",
      "Strong problem-solving abilities and attention to detail.",
      "Proficiency in CRM software and basic computer skills.",
      "Ability to work independently in a remote setting.",
    ],
    benefits: [
      "Competitive hourly wage.",
      "Flexible remote work options.",
      "Paid training.",
      "Health benefits.",
      "Opportunities for career advancement.",
      "Supportive team environment.",
    ],
  },
]

export default function CareerPositionPage() {
  const params = useParams()
  const positionId = params.position as string
  const [job, setJob] = useState<JobPosting | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const foundJob = jobPostings.find((p) => p.id === positionId)
    if (foundJob) {
      setJob(foundJob)
    } else {
      // Handle job not found, e.g., redirect to 404 or careers page
      console.error(`Job position with ID "${positionId}" not found.`)
    }
    setLoading(false)
  }, [positionId])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p>Loading job details...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Job Not Found</CardTitle>
            <CardDescription>The job posting you are looking for does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/careers">Back to Careers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link
          href="/careers"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Careers
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 text-lg">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {job.salary}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {job.type}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Description
              </h3>
              {job.description.map((paragraph, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>

            <Separator />

            {/* Responsibilities */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Responsibilities
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Qualifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Qualifications
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                {job.qualifications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Benefits
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                {job.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Apply Section */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Join Our Team?</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                We'd love to hear from you! Apply now and start your journey with Smiley Brooms.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="px-8 py-3">
                  Apply Now
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent" asChild>
                  <Link href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact HR
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                For inquiries, you can also reach us at{" "}
                <a href="mailto:careers@smileybrooms.com" className="text-primary hover:underline">
                  careers@smileybrooms.com
                </a>{" "}
                or call us at{" "}
                <a href="tel:+15551234567" className="text-primary hover:underline">
                  (555) 123-4567
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
