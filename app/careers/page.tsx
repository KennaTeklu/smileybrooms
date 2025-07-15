"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, DollarSign, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"

interface JobPosting {
  id: string
  title: string
  location: string
  salary: string
  type: string
  description: string
}

const jobPostings: JobPosting[] = [
  {
    id: "cleaner-specialist",
    title: "Professional Cleaning Specialist",
    location: "New York, NY",
    salary: "$20 - $25/hour",
    type: "Full-time, Part-time",
    description: "Join our dynamic team as a Cleaning Specialist and help us deliver sparkling results to our clients.",
  },
  {
    id: "operations-manager",
    title: "Operations Manager",
    location: "Brooklyn, NY",
    salary: "$60,000 - $75,000/year",
    type: "Full-time",
    description: "We are seeking an experienced Operations Manager to oversee our daily cleaning operations.",
  },
  {
    id: "customer-support-rep",
    title: "Customer Support Representative",
    location: "Remote",
    salary: "$18 - $22/hour",
    type: "Full-time, Remote",
    description: "As a Customer Support Representative, you will be the first point of contact for our clients.",
  },
  {
    id: "marketing-coordinator",
    title: "Marketing Coordinator",
    location: "New York, NY",
    salary: "$45,000 - $55,000/year",
    type: "Full-time",
    description: "Help us spread the word about Smiley Brooms and grow our customer base.",
  },
  {
    id: "team-lead",
    title: "Cleaning Team Lead",
    location: "Queens, NY",
    salary: "$25 - $30/hour",
    type: "Full-time",
    description: "Lead and motivate a team of cleaning specialists to deliver exceptional service.",
  },
]

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  const filteredJobs = jobPostings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = locationFilter === "" || job.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesType = typeFilter === "" || job.type.toLowerCase().includes(typeFilter.toLowerCase())
    return matchesSearch && matchesLocation && matchesType
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground">
            Be a part of Smiley Brooms and help us bring smiles to homes and offices.
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-12 shadow-lg">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title or keyword..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Input
              placeholder="Filter by location (e.g., New York)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <Input
              placeholder="Filter by type (e.g., Full-time)"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card key={job.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {job.type}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm line-clamp-3">{job.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={`/careers/${job.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground text-lg py-12">
              No job postings found matching your criteria.
            </div>
          )}
        </div>

        {/* Call to Action for General Inquiries */}
        <Card className="mt-16 text-center shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We're always growing! Send us your resume for future opportunities.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Submit Your Resume</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
